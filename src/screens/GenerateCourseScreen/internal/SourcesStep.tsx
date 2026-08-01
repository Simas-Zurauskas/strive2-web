'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Link2, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import { listSourceDocuments } from '@/api/routes/course/documents';
import {
  AlertDialog,
  Button,
  Eyebrow,
  FileDropzone,
  HelpAnchor,
  SOURCE_DOCUMENT_EXTENSIONS,
  Textarea,
  TextLoader,
} from '@/components';
import { analytics } from '@/lib/analytics';
import { QKeys } from '@/types';
import { FidelityPickerDialog, fidelityDescription, fidelityLabel } from './FidelityPickerDialog';
import * as S from './SourcesStep.styles';
import { useDocumentStatuses } from './useDocumentStatuses';
import type { SourcesJobFailure } from './useWizardHandlers';
import type { useWizardMutations } from './useWizardMutations';
import type {
  ClientApiError,
  Course,
  SourceAnalysis,
  SourceAnalysisMode,
  SourceDocument,
  SourceFidelity,
} from '@/api/types';
import type { FileDropzoneItem } from '@/components';

/** A9 caps, mirrored as copy — the server enforces the real limits. */
const UPLOAD_CAPS_HINT = 'Up to 10 files · 50 MB each · 10 links';
const GOAL_MAX_LENGTH = 500;

/**
 * Honest per-mode copy for the size estimate. `sourceScopeNote` (the
 * server-built multi-course note) arrives later on depthPreviews — the
 * analysis panel mirrors its message at this earlier point in the flow.
 */
const MODE_COPY: Record<SourceAnalysisMode, string | null> = {
  source_only: null,
  needs_supplement:
    'Your documents are thin in places — where they run out, lessons will be openly AI-supplemented rather than stretched.',
  multi_course:
    'Your documents hold more than one course’s worth of material. This course will cover a focused selection of it — you can create further courses from the same documents later.',
};

/**
 * The spec deliberately omits `sourceAssessment` from the Course schema
 * (coarse Mixed field); at runtime the API returns it on documents
 * courses. Narrow structural cast, same pattern as `depthPreviews`
 * casts elsewhere in the wizard.
 */
const readAssessment = (course: Course | undefined): SourceAnalysis | null =>
  ((course as (Course & { sourceAssessment?: SourceAnalysis | null }) | undefined)?.sourceAssessment ?? null);

const uploadErrorCopy = (err: ClientApiError, fileName?: string): string => {
  const meta = (err as { meta?: { limit?: number; have?: number } }).meta;
  switch (err.errorCode) {
    case 'UNSUPPORTED_FILE_TYPE': {
      // The extension is in our accept list yet the server rejected the
      // type — its magic-byte sniff found bytes that don't match the
      // claimed format (e.g. an .exe renamed .pdf). "Isn't supported"
      // would read wrong for a .pdf, so name the mismatch instead.
      const ext = fileName?.split('.').pop()?.toLowerCase() ?? '';
      if ((SOURCE_DOCUMENT_EXTENSIONS as readonly string[]).includes(ext)) {
        return "This file's content doesn't match its type — it may be corrupted or mislabeled.";
      }
      return "This file type isn't supported.";
    }
    case 'DOCUMENT_LIMIT_EXCEEDED':
      if (err.status === 413) return 'Too large — the limit is 50 MB per file.';
      return meta?.limit != null
        ? `Limit reached — up to ${meta.limit} allowed per course.`
        : 'Document limit reached for this course.';
    default:
      return err.message || 'Upload failed. Please try again.';
  }
};

interface UploadRow {
  localId: string;
  name: string;
  sizeBytes: number;
  progress: number | null;
  error: string | null;
}

interface SourcesStepProps {
  courseId: string | null;
  course: Course | undefined;
  mutations: ReturnType<typeof useWizardMutations>;
  /** True while an ingest (or any) job runs on this course. */
  isJobRunning: boolean;
  ingestFailure: SourcesJobFailure | null;
  confirmLoading: boolean;
  onEnsureCourse: () => Promise<string>;
  onIngest: () => void;
  onConfirm: (goal: string, fidelity: SourceFidelity) => void;
}

/**
 * Step 1 of the wizard in documents mode: upload files / add article
 * URLs, run the free ingest-and-assess pass with live per-document
 * status, then review the analysis (topics, size estimate, per-file
 * outcomes), edit the suggested goal, pick a fidelity level, and confirm
 * into the classic pipeline. Every async phase renders either content,
 * a loader, or an error card with a retry — never a blank body.
 */
export const SourcesStep = ({
  courseId,
  course,
  mutations,
  isJobRunning,
  ingestFailure,
  confirmLoading,
  onEnsureCourse,
  onIngest,
  onConfirm,
}: SourcesStepProps) => {
  const { uploadDocumentMutation, addUrlDocumentMutation, deleteDocumentMutation, queryClient } = mutations;
  const { statuses } = useDocumentStatuses(courseId);

  const documentsQuery = useQuery({
    queryKey: [QKeys.SOURCE_DOCUMENTS, courseId],
    queryFn: () => listSourceDocuments(courseId!),
    enabled: !!courseId,
  });
  const docs = documentsQuery.data ?? [];

  const [uploadRows, setUploadRows] = useState<UploadRow[]>([]);
  const uploadSeq = useRef(0);

  const [urlValue, setUrlValue] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlSubmitting, setUrlSubmitting] = useState(false);

  const analysis = readAssessment(course);
  const [goalDraft, setGoalDraft] = useState<string | null>(null);
  // Seed from the persisted dial on resume; default `guided` (Q4).
  const [fidelity, setFidelity] = useState<SourceFidelity>(course?.sourceFidelity ?? 'guided');
  const [fidelityDialogOpen, setFidelityDialogOpen] = useState(false);
  // Post-analysis, the upload UI collapses behind "Add more sources".
  const [addMoreOpen, setAddMoreOpen] = useState(false);
  const [switchDialogOpen, setSwitchDialogOpen] = useState(false);

  // Prefill order: live edit > the already-confirmed goal (clarifyData
  // present means the user confirmed once — course.goal is theirs, not
  // the server placeholder) > the analysis suggestion.
  const confirmedGoal = course?.clarifyData ? course?.goal : null;
  const goalValue = goalDraft ?? confirmedGoal ?? analysis?.suggestedGoal ?? '';

  const isUploadingAny = uploadRows.some((r) => r.error === null);

  const appendDocToCache = (cid: string, doc: SourceDocument) => {
    queryClient.setQueryData<SourceDocument[]>([QKeys.SOURCE_DOCUMENTS, cid], (old) => {
      const list = old ?? [];
      // Idempotent server re-returns the existing row for duplicate
      // content — dedupe by id so the list never shows the file twice.
      return list.some((d) => d.id === doc.id) ? list : [...list, doc];
    });
  };

  const handleFiles = async (files: File[]) => {
    let cid: string;
    try {
      cid = await onEnsureCourse();
    } catch {
      // Course creation failure already surfaced via the global mutation
      // toast; nothing was uploaded.
      return;
    }

    const kinds: string[] = [];
    let succeeded = 0;

    // Sequential per-file upload — bounded memory, per-file progress, and
    // typed per-file failures stay attributable to their row.
    for (const file of files) {
      const localId = `up-${++uploadSeq.current}`;
      setUploadRows((prev) => [
        ...prev,
        { localId, name: file.name, sizeBytes: file.size, progress: 0, error: null },
      ]);
      try {
        const doc = await uploadDocumentMutation.mutateAsync({
          courseId: cid,
          file,
          onProgress: (fraction) =>
            setUploadRows((prev) => prev.map((r) => (r.localId === localId ? { ...r, progress: fraction } : r))),
        });
        setUploadRows((prev) => prev.filter((r) => r.localId !== localId));
        appendDocToCache(cid, doc);
        succeeded += 1;
        kinds.push(file.name.split('.').pop()?.toLowerCase() ?? 'unknown');
      } catch (err) {
        setUploadRows((prev) =>
          prev.map((r) =>
            r.localId === localId
              ? { ...r, progress: null, error: uploadErrorCopy(err as ClientApiError, file.name) }
              : r,
          ),
        );
      }
    }

    if (succeeded > 0) {
      analytics.track('wizard_documents_uploaded', { count: succeeded, kinds });
    }
  };

  const handleAddUrl = async () => {
    const url = urlValue.trim();
    if (!url || urlSubmitting) return;
    setUrlError(null);
    setUrlSubmitting(true);
    try {
      const cid = await onEnsureCourse();
      const doc = await addUrlDocumentMutation.mutateAsync({ courseId: cid, url });
      appendDocToCache(cid, doc);
      setUrlValue('');
      analytics.track('wizard_documents_uploaded', { count: 1, kinds: ['url'] });
    } catch (err) {
      setUrlError(uploadErrorCopy(err as ClientApiError));
    } finally {
      setUrlSubmitting(false);
    }
  };

  const handleRemove = (id: string) => {
    if (id.startsWith('up-')) {
      setUploadRows((prev) => prev.filter((r) => r.localId !== id));
      return;
    }
    if (!courseId) return;
    deleteDocumentMutation.mutate(
      { courseId, documentId: id },
      {
        onSuccess: () => {
          queryClient.setQueryData<SourceDocument[]>([QKeys.SOURCE_DOCUMENTS, courseId], (old) =>
            (old ?? []).filter((d) => d.id !== id),
          );
        },
      },
    );
  };

  // Merge server rows (with live socket statuses layered on) + in-flight
  // local upload rows into the dropzone's row model.
  const perDocumentAnalysis = new Map((analysis?.perDocument ?? []).map((d) => [d.documentId, d]));
  const items: FileDropzoneItem[] = [
    ...docs.map((d): FileDropzoneItem => {
      const live = statuses[d.id];
      const assessed = perDocumentAnalysis.get(d.id);
      const status = live?.status ?? d.status;
      const warnings = Array.from(
        new Set([...(d.warnings ?? []), ...(live?.warnings ?? []), ...(assessed?.warnings ?? [])]),
      );
      const rejectionReason = assessed?.rejectionReason ?? d.rejectionReason;
      return {
        id: d.id,
        name: d.filename,
        sizeBytes: d.byteSize,
        status,
        warnings,
        isUrl: d.kind === 'url',
        error:
          status === 'rejected'
            ? rejectionReason || 'Rejected by content moderation.'
            : status === 'failed'
              ? "This document couldn't be read."
              : null,
      };
    }),
    ...uploadRows.map(
      (r): FileDropzoneItem => ({
        id: r.localId,
        name: r.name,
        sizeBytes: r.sizeBytes,
        status: r.error ? 'error' : 'uploading',
        progress: r.progress,
        error: r.error,
      }),
    ),
  ];

  const hasPendingDocs = docs.some((d) => (statuses[d.id]?.status ?? d.status) === 'uploaded');
  const showAnalysis = !!analysis && !isJobRunning && !ingestFailure;
  const canAnalyze = docs.length > 0 && !isUploadingAny && !isJobRunning && !mutations.ingestDocumentsMutation.isPending;

  // The add-sources UI (drop area + link field) shows during the initial
  // upload phase and the post-failure retry phase, hides entirely while a
  // job runs (doc rows with live chips stay), and collapses behind the
  // "Add more sources" button once the analysis panel is up.
  const showAddUI = !isJobRunning && (!showAnalysis || addMoreOpen);

  // Every ingest start collapses the add-more expansion so the next
  // analysis panel opens back in its compact state.
  const handleIngest = () => {
    setAddMoreOpen(false);
    onIngest();
  };

  // Hard navigation on purpose: /courses/new is this same route, and a
  // client-side push keeps the mounted wizard (and its documents-mode
  // state) alive. A full document load guarantees a fresh goal wizard.
  const goToStandardWizard = () => {
    window.location.assign('/courses/new');
  };

  const handleSwitchToStandard = () => {
    if (docs.length > 0 || uploadRows.length > 0) {
      setSwitchDialogOpen(true);
      return;
    }
    goToStandardWizard();
  };

  const contentRejected = ingestFailure?.errorCode === 'CONTENT_REJECTED';
  const rejectMeta = (ingestFailure?.errorMeta ?? {}) as { rejected?: number; failed?: number; prepared?: number };

  return (
    <S.Container>
      <S.Header>
        <Eyebrow>
          Source Material <HelpAnchor concept="course-from-documents" size="sm" />
        </Eyebrow>
        <S.Title>Start from your documents</S.Title>
        <S.Subtitle>
          Upload notes, books, slides, spreadsheets, recordings — or paste article links. We&apos;ll read them,
          tell you what they can teach, and build your course on top.
        </S.Subtitle>
      </S.Header>

      <FileDropzone
        items={items}
        disabled={isJobRunning || confirmLoading}
        hint={UPLOAD_CAPS_HINT}
        showDropArea={showAddUI}
        onFiles={(files) => void handleFiles(files)}
        onRemove={handleRemove}
      />

      {showAnalysis && !addMoreOpen && (
        <S.AddMoreRow>
          <S.AddMoreButton type="button" onClick={() => setAddMoreOpen(true)} disabled={confirmLoading}>
            <Plus aria-hidden /> Add more sources
          </S.AddMoreButton>
        </S.AddMoreRow>
      )}

      {showAddUI && (
        <S.UrlRow>
          <S.UrlField $error={!!urlError}>
            <S.UrlFieldIcon aria-hidden>
              <Link2 />
            </S.UrlFieldIcon>
            <S.UrlInput
              type="url"
              placeholder="Paste a public article link"
              value={urlValue}
              aria-label="Public article URL"
              aria-invalid={!!urlError}
              aria-describedby={urlError ? 'source-url-error' : undefined}
              disabled={confirmLoading}
              onChange={(e) => {
                setUrlValue(e.target.value);
                if (urlError) setUrlError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleAddUrl();
                }
              }}
            />
            <S.UrlAddButton
              type="button"
              onClick={() => void handleAddUrl()}
              disabled={!urlValue.trim() || urlSubmitting || confirmLoading}
            >
              {urlSubmitting ? <S.UrlSpinner aria-hidden /> : <Plus aria-hidden />}
              Add link
            </S.UrlAddButton>
          </S.UrlField>
          {urlError && (
            <S.UrlError id="source-url-error" role="alert">
              {urlError}
            </S.UrlError>
          )}
        </S.UrlRow>
      )}

      {showAnalysis && addMoreOpen && (
        <S.AddMoreHint>
          New sources need a quick re-analysis before they count — add them, then use &ldquo;Analyze new
          sources&rdquo; below.
        </S.AddMoreHint>
      )}

      {/* ── Analyze phase ─────────────────────────────── */}

      {isJobRunning && !analysis && <TextLoader text="Analyzing your sources..." />}
      {isJobRunning && analysis && <TextLoader text="Re-analyzing your sources..." />}

      {ingestFailure && !isJobRunning && (
        <S.ErrorCard role="alert">
          <S.ErrorTitle>{contentRejected ? 'Some sources were rejected' : "We couldn't analyze your sources"}</S.ErrorTitle>
          <S.ErrorBody>
            {contentRejected ? (
              <>
                {typeof rejectMeta.rejected === 'number' && rejectMeta.rejected > 0 && (
                  <>{rejectMeta.rejected} rejected by content moderation. </>
                )}
                {typeof rejectMeta.failed === 'number' && rejectMeta.failed > 0 && (
                  <>{rejectMeta.failed} could not be read. </>
                )}
                See each file&apos;s row above for its category. Remove the rejected files and analyze again, or
                start from a typed goal instead.
              </>
            ) : (
              ingestFailure.error || 'Something went wrong during the analysis. Your files are safe — try again.'
            )}
          </S.ErrorBody>
          <S.ErrorActions>
            <Button type="button" variant="secondary" onClick={handleIngest} disabled={!canAnalyze}>
              Try again
            </Button>
            <S.SwitchModeButton type="button" onClick={handleSwitchToStandard}>
              Start from a goal instead &rarr;
            </S.SwitchModeButton>
          </S.ErrorActions>
        </S.ErrorCard>
      )}

      {!showAnalysis && !ingestFailure && !isJobRunning && (
        <S.AnalyzeRow>
          <S.AnalyzeHint>
            {docs.length === 0
              ? 'Add at least one file or link to continue.'
              : 'Free analysis — we check what your sources can teach before anything is generated.'}
          </S.AnalyzeHint>
          <Button
            type="button"
            onClick={handleIngest}
            disabled={!canAnalyze}
            loading={mutations.ingestDocumentsMutation.isPending}
          >
            Analyze sources
          </Button>
        </S.AnalyzeRow>
      )}

      {/* ── Analysis panel ────────────────────────────── */}

      {showAnalysis && analysis && (
        <S.AnalysisPanel>
          <S.PanelDivider aria-hidden />
          <S.PanelEyebrow>What your sources can teach</S.PanelEyebrow>

          {analysis.topics.length > 0 && (
            <S.TopicChips>
              {analysis.topics.map((topic) => (
                <S.TopicChip key={topic}>{topic}</S.TopicChip>
              ))}
            </S.TopicChips>
          )}

          <S.SizeLine>
            Estimated course size:{' '}
            <strong>
              {analysis.sizeBand.minLessons === analysis.sizeBand.maxLessons
                ? `~${analysis.sizeBand.minLessons} lessons`
                : `${analysis.sizeBand.minLessons}–${analysis.sizeBand.maxLessons} lessons`}
            </strong>
          </S.SizeLine>

          {MODE_COPY[analysis.sizeBand.mode] && <S.ModeNote>{MODE_COPY[analysis.sizeBand.mode]}</S.ModeNote>}

          {analysis.warnings.length > 0 && (
            <S.WarningList>
              {analysis.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </S.WarningList>
          )}

          {analysis.questions.length > 0 && (
            <S.QuestionsBlock>
              <S.QuestionsCaption>Worth clarifying as you go</S.QuestionsCaption>
              <S.QuestionsList>
                {analysis.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </S.QuestionsList>
            </S.QuestionsBlock>
          )}

          <S.GoalBlock>
            <Textarea
              label="Your course goal (suggested from your documents — edit freely)"
              name="sourceGoal"
              value={goalValue}
              rows={3}
              onChange={(e) => setGoalDraft(e.target.value.slice(0, GOAL_MAX_LENGTH))}
            />
          </S.GoalBlock>

          <S.FidelityCard
            type="button"
            aria-haspopup="dialog"
            onClick={() => setFidelityDialogOpen(true)}
            disabled={confirmLoading}
          >
            <S.FidelityCardBody>
              <S.FidelityCardEyebrow>How closely to follow your materials</S.FidelityCardEyebrow>
              <S.FidelityCardValue>{fidelityLabel(fidelity)}</S.FidelityCardValue>
              <S.FidelityCardDescription>{fidelityDescription(fidelity)}</S.FidelityCardDescription>
            </S.FidelityCardBody>
            <S.FidelityCardAction aria-hidden>
              Change <ChevronRight />
            </S.FidelityCardAction>
          </S.FidelityCard>

          <S.ConfirmRow>
            {hasPendingDocs && (
              <Button type="button" variant="secondary" onClick={handleIngest} disabled={!canAnalyze}>
                Analyze new sources
              </Button>
            )}
            <Button
              type="button"
              onClick={() => onConfirm(goalValue.trim(), fidelity)}
              loading={confirmLoading}
              disabled={!goalValue.trim()}
            >
              Confirm &amp; Continue
            </Button>
          </S.ConfirmRow>
        </S.AnalysisPanel>
      )}

      {/* Mode-switch escape: back to the classic typed-goal wizard. */}
      <S.SwitchModeRow>
        <S.SwitchModeButton type="button" onClick={handleSwitchToStandard}>
          Prefer to just describe your goal? Switch to standard creation &rarr;
        </S.SwitchModeButton>
      </S.SwitchModeRow>

      <FidelityPickerDialog
        open={fidelityDialogOpen}
        value={fidelity}
        onSelect={(next) => {
          setFidelity(next);
          setFidelityDialogOpen(false);
        }}
        onCancel={() => setFidelityDialogOpen(false)}
      />

      <AlertDialog
        open={switchDialogOpen}
        title="Switch to standard creation?"
        description="Your uploaded sources stay saved in this draft — you can pick it back up from your courses list anytime."
        confirmLabel="Switch"
        cancelLabel="Stay here"
        variant="neutral"
        onConfirm={goToStandardWizard}
        onCancel={() => setSwitchDialogOpen(false)}
      />
    </S.Container>
  );
};
