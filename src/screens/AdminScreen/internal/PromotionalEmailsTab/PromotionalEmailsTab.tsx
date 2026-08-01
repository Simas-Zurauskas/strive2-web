'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  sendPromotionalTestEmail,
  sendMarketingCampaign,
  getMarketingCampaignStatus,
  reclaimMarketingClaims,
  type PromotionalTemplateKey,
  type MarketingCampaignKey,
  type MarketingSendResult,
  type MarketingCampaignStatus,
} from '@/api/routes/admin';
import { Button } from '@/components';
import * as S from './PromotionalEmailsTab.styles';

// One entry per template the backdoor route accepts. Adding a new
// template here is the only client-side change needed once the API
// `PromotionalTemplateKey` enum + builder are in place.
const TEMPLATES: { key: PromotionalTemplateKey; label: string; description: string }[] = [
  {
    key: 'documents_feature',
    label: 'Documents feature announcement',
    description:
      'Announces building a course from your own documents and links. This is the template the documents-feature campaign sends. If the address is a known marketing contact, the test carries that contact’s real one-click unsubscribe link.',
  },
];

// Campaigns the operator may run. The key is validated server-side against a
// closed set, and the template is bound to it there — so this list is a
// label, never the thing that decides what gets sent.
const CAMPAIGNS: { key: MarketingCampaignKey; label: string; description: string }[] = [
  {
    key: 'documents-feature-2026-08',
    label: 'Documents feature (2026-08)',
    description:
      'Sends the documents feature announcement to every marketing contact who has not opted out and has not already received it.',
  },
];

const MAX_BATCH = 250;
const DEFAULT_BATCH = 50;

type Status = { kind: 'success' | 'error' | 'info'; message: string } | null;

const pillKind = (status: MarketingSendResult['status']): 'sent' | 'skipped' | 'failed' =>
  status === 'sent' ? 'sent' : status === 'failed' ? 'failed' : 'skipped';

const errorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : fallback;

export const PromotionalEmailsTab: React.FC = () => {
  // ── Single-address test send ────────────────────────────
  const [to, setTo] = useState('');
  const [template, setTemplate] = useState<PromotionalTemplateKey>(TEMPLATES[0].key);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // ── Campaign panel ──────────────────────────────────────
  const [campaign, setCampaign] = useState<MarketingCampaignKey>(CAMPAIGNS[0].key);
  const [batchSize, setBatchSize] = useState(DEFAULT_BATCH);
  const [confirm, setConfirm] = useState('');
  const [campaignStatus, setCampaignStatus] = useState<MarketingCampaignStatus | null>(null);
  const [results, setResults] = useState<MarketingSendResult[]>([]);
  // Running totals across every batch in this session — the per-batch
  // response only describes its own batch, and the operator needs to know
  // what the whole run has done.
  const [totals, setTotals] = useState({ sent: 0, skipped: 0, failed: 0 });
  const [batchRunning, setBatchRunning] = useState(false);
  const [reclaiming, setReclaiming] = useState(false);
  const [campaignMessage, setCampaignMessage] = useState<Status>(null);

  const refreshCampaign = useCallback(async () => {
    try {
      setCampaignStatus(await getMarketingCampaignStatus({ campaignKey: campaign }));
    } catch (err: unknown) {
      setCampaignMessage({ kind: 'error', message: errorMessage(err, 'Could not load campaign.') });
    }
  }, [campaign]);

  useEffect(() => {
    setResults([]);
    setTotals({ sent: 0, skipped: 0, failed: 0 });
    setCampaignMessage(null);
    void refreshCampaign();
  }, [refreshCampaign]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || sending) return;

    setSending(true);
    setStatus(null);
    try {
      await sendPromotionalTestEmail({ to: to.trim(), template });
      setStatus({ kind: 'success', message: `Sent ${template} to ${to.trim()}.` });
    } catch (err: unknown) {
      setStatus({ kind: 'error', message: errorMessage(err, 'Send failed.') });
    } finally {
      setSending(false);
    }
  };

  const onSendBatch = async () => {
    if (batchRunning || confirm !== campaign) return;

    setBatchRunning(true);
    setCampaignMessage(null);
    try {
      const batch = await sendMarketingCampaign({
        campaignKey: campaign,
        batchSize,
        confirm,
      });
      setResults(batch.results);
      setTotals((t) => ({
        sent: t.sent + batch.sentCount,
        skipped: t.skipped + batch.skippedCount,
        failed: t.failed + batch.failedCount,
      }));
      setCampaignMessage({
        kind: batch.failedCount > 0 ? 'error' : 'success',
        message: `Batch done — ${batch.sentCount} sent, ${batch.skippedCount} skipped, ${batch.failedCount} failed. ${batch.remainingCount} still to go.`,
      });
      // Typed confirmation is per batch on purpose: "send the next 50" should
      // stay a deliberate act, not a button that keeps working.
      setConfirm('');
      await refreshCampaign();
    } catch (err: unknown) {
      setCampaignMessage({ kind: 'error', message: errorMessage(err, 'Batch failed.') });
    } finally {
      setBatchRunning(false);
    }
  };

  const onReclaim = async () => {
    if (reclaiming) return;
    setReclaiming(true);
    setCampaignMessage(null);
    try {
      const { reclaimedCount } = await reclaimMarketingClaims({ campaignKey: campaign });
      setCampaignMessage({
        kind: 'info',
        message:
          reclaimedCount > 0
            ? `Released ${reclaimedCount} stranded claim${reclaimedCount === 1 ? '' : 's'} — the next batch will retry them.`
            : 'Nothing to release.',
      });
      await refreshCampaign();
    } catch (err: unknown) {
      setCampaignMessage({ kind: 'error', message: errorMessage(err, 'Reclaim failed.') });
    } finally {
      setReclaiming(false);
    }
  };

  const activeTemplate = TEMPLATES.find((t) => t.key === template);
  const activeCampaign = CAMPAIGNS.find((c) => c.key === campaign);
  const strandedCount = campaignStatus?.strandedClaims.length ?? 0;

  return (
    <S.Stack>
      <S.Card as="form" onSubmit={onSubmit}>
        <S.SectionTitle>Send a test promotional email</S.SectionTitle>
        <S.Description>
          Sends the selected template synchronously via Mailjet to the address below, regardless of
          whether it&apos;s a registered user. Use sparingly against real inboxes — Mailjet quota and
          sender reputation apply.
        </S.Description>

        <S.Field>
          <S.FieldLabel>Recipient email</S.FieldLabel>
          <S.Input
            type="email"
            required
            autoComplete="off"
            placeholder="someone@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            disabled={sending}
          />
        </S.Field>

        <S.Field>
          <S.FieldLabel>Template</S.FieldLabel>
          <S.Select
            value={template}
            onChange={(e) => setTemplate(e.target.value as PromotionalTemplateKey)}
            disabled={sending}
          >
            {TEMPLATES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </S.Select>
          {activeTemplate && <S.Description>{activeTemplate.description}</S.Description>}
        </S.Field>

        <S.Actions>
          <Button type="submit" disabled={sending || !to.trim()}>
            {sending ? 'Sending…' : 'Send test email'}
          </Button>
          {status && <S.StatusLine $kind={status.kind}>{status.message}</S.StatusLine>}
        </S.Actions>
      </S.Card>

      <S.Card>
        <S.SectionTitle>Send a campaign</S.SectionTitle>
        <S.Description>
          Sends to real people, one batch per click. The audience and the template are both decided
          on the server; each recipient is claimed before delivery, so a repeated batch skips
          everyone who already received it.
        </S.Description>

        <S.Field>
          <S.FieldLabel>Campaign</S.FieldLabel>
          <S.Select
            value={campaign}
            onChange={(e) => setCampaign(e.target.value as MarketingCampaignKey)}
            disabled={batchRunning}
          >
            {CAMPAIGNS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </S.Select>
          {activeCampaign && <S.Description>{activeCampaign.description}</S.Description>}
        </S.Field>

        <S.Toolbar>
          <S.Stat>
            Audience <strong>{campaignStatus?.audienceCount ?? '—'}</strong>
          </S.Stat>
          <S.Stat>
            Sent <strong>{campaignStatus?.sentCount ?? '—'}</strong>
          </S.Stat>
          <S.Stat>
            Remaining <strong>{campaignStatus?.remainingCount ?? '—'}</strong>
          </S.Stat>
          <S.Stat>
            Awaiting retry <strong>{campaignStatus?.failedCount ?? '—'}</strong>
          </S.Stat>
          <S.Stat>
            Hard bounced <strong>{campaignStatus?.hardBouncedCount ?? '—'}</strong>
          </S.Stat>
        </S.Toolbar>

        {strandedCount > 0 && (
          <S.Warning>
            <strong>{strandedCount}</strong> claim{strandedCount === 1 ? '' : 's'} stranded — a send
            was interrupted after the recipient was claimed but before delivery. Those addresses are
            blocked from every later batch until they are released.
            <br />
            <Button type="button" onClick={onReclaim} disabled={reclaiming}>
              {reclaiming ? 'Releasing…' : 'Release stranded claims'}
            </Button>
          </S.Warning>
        )}

        <S.BatchControls>
          <S.Field>
            <S.FieldLabel>Batch size</S.FieldLabel>
            <S.SmallInput
              type="number"
              min={1}
              max={MAX_BATCH}
              value={batchSize}
              onChange={(e) =>
                setBatchSize(Math.min(MAX_BATCH, Math.max(1, Number(e.target.value) || 1)))
              }
              disabled={batchRunning}
            />
          </S.Field>
          <S.Field>
            <S.FieldLabel>Type the campaign key to confirm</S.FieldLabel>
            <S.ConfirmInput
              type="text"
              autoComplete="off"
              placeholder={campaign}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={batchRunning}
            />
          </S.Field>
          <Button type="button" onClick={onSendBatch} disabled={batchRunning || confirm !== campaign}>
            {batchRunning ? 'Sending…' : `Send next ${batchSize}`}
          </Button>
        </S.BatchControls>

        {campaignMessage && (
          <S.StatusLine $kind={campaignMessage.kind}>{campaignMessage.message}</S.StatusLine>
        )}

        {(totals.sent > 0 || totals.skipped > 0 || totals.failed > 0) && (
          <S.Toolbar>
            <S.Stat>
              This session — sent <strong>{totals.sent}</strong>
            </S.Stat>
            <S.Stat>
              skipped <strong>{totals.skipped}</strong>
            </S.Stat>
            <S.Stat>
              failed <strong>{totals.failed}</strong>
            </S.Stat>
          </S.Toolbar>
        )}

        {results.length > 0 && (
          <S.TableWrap>
            <S.Table>
              <thead>
                <tr>
                  <S.Th>Recipient</S.Th>
                  <S.Th>Result</S.Th>
                  <S.Th>Detail</S.Th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <S.Tr key={r.email}>
                    <S.Td>{r.email}</S.Td>
                    <S.Td>
                      <S.Pill $kind={pillKind(r.status)}>{r.status.replace(/_/g, ' ')}</S.Pill>
                    </S.Td>
                    <S.Td $muted>{r.error ?? '—'}</S.Td>
                  </S.Tr>
                ))}
              </tbody>
            </S.Table>
          </S.TableWrap>
        )}
      </S.Card>
    </S.Stack>
  );
};
