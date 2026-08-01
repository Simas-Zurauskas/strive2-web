'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, FileText, Link2, UploadCloud, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './FileDropzone.styles';
import type { SourceDocumentStatus } from '@/api/types';

/**
 * Launch-set upload formats (PLAN §3.2). Extensions only — the server
 * re-verifies the claimed type against the file bytes, so this list is a
 * UX filter, not a security boundary. Public article URLs are added
 * through a separate input owned by the hosting step, not this dropzone.
 */
export const SOURCE_DOCUMENT_EXTENSIONS = [
  'pdf',
  'docx',
  'pptx',
  'xlsx',
  'odt',
  'odp',
  'ods',
  'epub',
  'txt',
  'md',
  'html',
  'csv',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'heic',
  'mp3',
  'm4a',
  'wav',
] as const;

export const SOURCE_DOCUMENT_ACCEPT = SOURCE_DOCUMENT_EXTENSIONS.map((ext) => `.${ext}`).join(',');

/** 50 MB per file — mirrors the server's multer cap (PLAN A9). */
export const MAX_SOURCE_DOCUMENT_BYTES = 50 * 1024 * 1024;

/**
 * Row status. Extends the wire enum (`SourceDocumentStatus`, imported
 * from the OpenAPI types) with client-only transfer states that never
 * cross the wire: 'uploading' (request in flight) and 'error' (upload
 * failed before a server row existed).
 */
export type FileDropzoneItemStatus = SourceDocumentStatus | 'uploading' | 'error';

export interface FileDropzoneItem {
  id: string;
  name: string;
  sizeBytes?: number | null;
  status: FileDropzoneItemStatus;
  /** 0..1 while uploading; drives the per-file progress bar. */
  progress?: number | null;
  warnings?: string[];
  /** Inline error copy for 'error' / 'rejected' / 'failed' rows. */
  error?: string | null;
  /** Small kind hint rendered before the name ('Link' rows get a link icon). */
  isUrl?: boolean;
  removable?: boolean;
}

interface FileDropzoneProps {
  items: FileDropzoneItem[];
  disabled?: boolean;
  /** Defaults to the §3.2 launch set. */
  accept?: string;
  maxFileSizeBytes?: number;
  /** Copy under the CTA, e.g. the caps line. */
  hint?: string;
  /**
   * When false, the drop/browse surface is hidden and only the per-file
   * rows render — used while an ingest job runs and after analysis, when
   * adding more sources is a deliberate action rather than the default.
   */
  showDropArea?: boolean;
  onFiles: (accepted: File[]) => void;
  onRemove?: (id: string) => void;
}

export const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, '')} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

const STATUS_LABELS: Record<FileDropzoneItemStatus, string> = {
  uploaded: 'Uploaded',
  parsing: 'Analyzing',
  parsed: 'Analyzed',
  rejected: 'Rejected',
  failed: 'Failed',
  uploading: 'Uploading',
  error: 'Upload failed',
};

interface LocalRejection {
  id: string;
  name: string;
  reason: string;
}

let rejectionSeq = 0;

/**
 * Shared drag-and-drop + click-to-browse upload surface with per-file
 * rows (status chip, warning icons, progress, remove). Client-side
 * pre-checks — 50 MB size cap and the launch-format extension list — run
 * before any byte leaves the browser; failing files render as inline
 * dismissible error rows and are never passed to `onFiles`.
 */
export const FileDropzone = ({
  items,
  disabled = false,
  accept = SOURCE_DOCUMENT_ACCEPT,
  maxFileSizeBytes = MAX_SOURCE_DOCUMENT_BYTES,
  hint,
  showDropArea = true,
  onFiles,
  onRemove,
}: FileDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [rejections, setRejections] = useState<LocalRejection[]>([]);
  const { fadeUp } = useMotion();

  const acceptedExtensions = accept
    .split(',')
    .map((a) => a.trim().replace(/^\./, '').toLowerCase())
    .filter(Boolean);

  const handleIncoming = useCallback(
    (files: FileList | File[]) => {
      if (disabled) return;
      const accepted: File[] = [];
      const rejected: LocalRejection[] = [];

      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        if (!acceptedExtensions.includes(ext)) {
          rejected.push({
            id: `rej-${++rejectionSeq}`,
            name: file.name,
            reason: 'Unsupported format.',
          });
          continue;
        }
        if (file.size > maxFileSizeBytes) {
          rejected.push({
            id: `rej-${++rejectionSeq}`,
            name: file.name,
            reason: `Too large (${formatBytes(file.size)}) — the limit is ${formatBytes(maxFileSizeBytes)} per file.`,
          });
          continue;
        }
        if (file.size === 0) {
          rejected.push({ id: `rej-${++rejectionSeq}`, name: file.name, reason: 'File is empty.' });
          continue;
        }
        accepted.push(file);
      }

      if (rejected.length > 0) setRejections((prev) => [...prev, ...rejected]);
      if (accepted.length > 0) onFiles(accepted);
    },
    [disabled, acceptedExtensions, maxFileSizeBytes, onFiles],
  );

  const dismissRejection = (id: string) => setRejections((prev) => prev.filter((r) => r.id !== id));

  return (
    <S.Container>
      {showDropArea && (
        <>
          <S.DropArea
            type="button"
            $active={dragActive}
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleIncoming(e.dataTransfer.files);
            }}
            aria-label="Upload documents — drag files here or click to browse"
          >
            <UploadCloud aria-hidden />
            <S.DropTitle>Drop your files here</S.DropTitle>
            <S.DropSub>or click to browse</S.DropSub>
            {hint && <S.DropHint>{hint}</S.DropHint>}
          </S.DropArea>

          <S.HiddenInput
            ref={inputRef}
            type="file"
            multiple
            accept={accept}
            onChange={(e) => {
              if (e.target.files) handleIncoming(e.target.files);
              // Reset so re-selecting the same file fires onChange again.
              e.target.value = '';
            }}
            tabIndex={-1}
            aria-hidden
          />
        </>
      )}

      {(items.length > 0 || rejections.length > 0) && (
        <S.Rows>
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const failed = item.status === 'error' || item.status === 'rejected' || item.status === 'failed';
              return (
                <motion.div key={item.id} layout {...fadeUp} exit={{ opacity: 0 }}>
                  <S.Row $failed={failed}>
                    <S.RowIcon aria-hidden>{item.isUrl ? <Link2 /> : <FileText />}</S.RowIcon>
                    <S.RowBody>
                      <S.RowNameLine>
                        <S.RowName title={item.name}>{item.name}</S.RowName>
                        {item.sizeBytes != null && item.sizeBytes > 0 && (
                          <S.RowSize>{formatBytes(item.sizeBytes)}</S.RowSize>
                        )}
                        {item.warnings && item.warnings.length > 0 && (
                          <S.WarningTip
                            label={
                              item.warnings.length === 1
                                ? `Warning for ${item.name}`
                                : `${item.warnings.length} warnings for ${item.name}`
                            }
                            content={
                              <S.WarningTooltipContent>
                                {item.warnings.map((w) => (
                                  <span key={w}>{w}</span>
                                ))}
                              </S.WarningTooltipContent>
                            }
                          >
                            <S.WarningIcon aria-hidden>
                              <AlertTriangle />
                            </S.WarningIcon>
                          </S.WarningTip>
                        )}
                      </S.RowNameLine>
                      {item.status === 'uploading' && (
                        <S.ProgressTrack aria-hidden>
                          <S.ProgressFill style={{ width: `${Math.round((item.progress ?? 0) * 100)}%` }} />
                        </S.ProgressTrack>
                      )}
                      {failed && item.error && <S.RowError>{item.error}</S.RowError>}
                    </S.RowBody>
                    <S.StatusChip $status={item.status}>{STATUS_LABELS[item.status]}</S.StatusChip>
                    {item.removable !== false && onRemove && item.status !== 'uploading' && (
                      <S.RemoveButton
                        type="button"
                        onClick={() => onRemove(item.id)}
                        disabled={disabled}
                        aria-label={`Remove ${item.name}`}
                      >
                        <X aria-hidden />
                      </S.RemoveButton>
                    )}
                  </S.Row>
                </motion.div>
              );
            })}

            {rejections.map((rej) => (
              <motion.div key={rej.id} layout {...fadeUp} exit={{ opacity: 0 }}>
                <S.Row $failed>
                  <S.RowIcon aria-hidden>
                    <AlertTriangle />
                  </S.RowIcon>
                  <S.RowBody>
                    <S.RowNameLine>
                      <S.RowName title={rej.name}>{rej.name}</S.RowName>
                    </S.RowNameLine>
                    <S.RowError>{rej.reason}</S.RowError>
                  </S.RowBody>
                  <S.RemoveButton type="button" onClick={() => dismissRejection(rej.id)} aria-label={`Dismiss ${rej.name}`}>
                    <X aria-hidden />
                  </S.RemoveButton>
                </S.Row>
              </motion.div>
            ))}
          </AnimatePresence>
        </S.Rows>
      )}
    </S.Container>
  );
};
