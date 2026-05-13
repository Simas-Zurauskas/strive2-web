'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  addRelaunchRecipient,
  deleteRelaunchRecipient,
  listRelaunchRecipients,
  sendRelaunchBatch,
  updateRelaunchGrant,
  updateRelaunchPaying,
  type RelaunchBatchResult,
  type RelaunchRecipient,
  type RelaunchRecipientStatusFilter,
} from '@/api/routes/admin';
import { Button } from '@/components';
import * as S from './RelaunchTab.styles';

// Admin tab for driving the old-Strive relaunch mailing.
//
//   - Paginated roster of `RelaunchRecipient` rows.
//   - Filters: status (pending/sent/all), paying-only toggle, email search.
//   - Per-row Send button (disabled once sent) + "Send next N" batch button.
//   - Per-row template choice via "Use paying template" toggle (paying-user
//     thanks copy) — controls which Mailjet template ships for the next send
//     action. Defaults to the standard relaunch.
//   - Inline grant editor — click the $X amount, edit in place, save back to
//     the SignupCreditGrant row. Disabled if the grant has already been
//     claimed (the credit's on the user's account; changing the dollar
//     amount post-hoc would desync from the CreditLedger row).
//   - Mark-as-paying checkbox per row — flips `wasPayingUser` so the operator
//     can curate the list from the UI without re-running the import script.

const PAGE_SIZE = 100;
const DEFAULT_BATCH = 50;
const SEARCH_DEBOUNCE_MS = 250;

const STATUS_FILTERS: { key: RelaunchRecipientStatusFilter; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'sent', label: 'Sent' },
  { key: 'all', label: 'All' },
];

type SendStatus = RelaunchBatchResult['status'];

type LastSend =
  | { kind: 'success' | 'info'; message: string }
  | { kind: 'error'; message: string }
  | null;

export const RelaunchTab: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<RelaunchRecipientStatusFilter>('pending');
  const [payingOnly, setPayingOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [batchSize, setBatchSize] = useState(DEFAULT_BATCH);
  const [recipients, setRecipients] = useState<RelaunchRecipient[]>([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [payingCount, setPayingCount] = useState(0);
  const [signedUpCount, setSignedUpCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [rowStatus, setRowStatus] = useState<Record<string, SendStatus>>({});
  const [lastSend, setLastSend] = useState<LastSend>(null);
  const [editingGrantFor, setEditingGrantFor] = useState<string | null>(null);
  const [editGrantValue, setEditGrantValue] = useState('');
  const [busyRow, setBusyRow] = useState<string | null>(null);
  const [addEmail, setAddEmail] = useState('');
  const [addUsd, setAddUsd] = useState('5');
  const [addPaying, setAddPaying] = useState(false);
  const [addBusy, setAddBusy] = useState(false);

  // Debounce the search input so each keystroke doesn't issue a new fetch.
  // Resets `offset` to 0 in the effect below — paging the user 12 pages into
  // a 3000-row list and then typing a search would otherwise leave them
  // stranded on an empty offset for the new result set.
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setOffset(0);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [query]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // When a search is active, ignore the status filter — the operator is
      // looking for a specific address regardless of whether the relaunch
      // email has been sent to it yet. The paying filter still applies.
      const effectiveStatus = debouncedQuery ? 'all' : statusFilter;
      const res = await listRelaunchRecipients({
        status: effectiveStatus,
        paying: payingOnly ? 'only' : 'any',
        q: debouncedQuery || undefined,
        limit: PAGE_SIZE,
        offset,
      });
      setRecipients(res.recipients);
      setTotal(res.total);
      setPendingCount(res.pendingCount);
      setSentCount(res.sentCount);
      setPayingCount(res.payingCount);
      setSignedUpCount(res.signedUpCount);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, payingOnly, debouncedQuery, offset]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sendOne = async (email: string) => {
    setSending(true);
    setLastSend({ kind: 'info', message: `Sending to ${email}…` });
    try {
      const res = await sendRelaunchBatch({ emails: [email] });
      const outcome = res.results[0];
      if (outcome) {
        setRowStatus((prev) => ({ ...prev, [outcome.email]: outcome.status }));
      }
      const ok = outcome?.status === 'sent';
      setLastSend({
        kind: ok ? 'success' : 'error',
        message: ok
          ? `Sent to ${email}.`
          : `Did not send to ${email}: ${outcome?.status ?? 'unknown'}${outcome?.error ? ` (${outcome.error})` : ''}`,
      });
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Send failed.';
      setLastSend({ kind: 'error', message });
    } finally {
      setSending(false);
    }
  };

  const sendBatch = async () => {
    const pending = recipients.filter((r) => !r.sent).slice(0, batchSize).map((r) => r.email);
    if (pending.length === 0) {
      setLastSend({ kind: 'info', message: 'No pending recipients on this page.' });
      return;
    }
    setSending(true);
    setLastSend({ kind: 'info', message: `Sending to ${pending.length} recipient(s)…` });
    try {
      const res = await sendRelaunchBatch({ emails: pending });
      const update: Record<string, SendStatus> = {};
      for (const r of res.results) update[r.email] = r.status;
      setRowStatus((prev) => ({ ...prev, ...update }));
      setLastSend({
        kind: res.failedCount > 0 ? 'error' : 'success',
        message: `Sent ${res.sentCount}, skipped ${res.skippedCount}, failed ${res.failedCount}.`,
      });
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Batch failed.';
      setLastSend({ kind: 'error', message });
    } finally {
      setSending(false);
    }
  };

  const openGrantEdit = (r: RelaunchRecipient) => {
    if (r.grantConsumed) return;
    setEditingGrantFor(r.email);
    setEditGrantValue(r.grantUsd != null ? String(r.grantUsd) : '');
  };

  const saveGrant = async (email: string) => {
    const value = Number(editGrantValue);
    if (!Number.isFinite(value) || value < 0) {
      setLastSend({ kind: 'error', message: `Invalid grant value: ${editGrantValue}` });
      return;
    }
    setBusyRow(email);
    try {
      await updateRelaunchGrant({ email, usdAmount: value });
      setEditingGrantFor(null);
      setLastSend({ kind: 'success', message: `Grant for ${email} set to $${value}.` });
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update grant.';
      setLastSend({ kind: 'error', message });
    } finally {
      setBusyRow(null);
    }
  };

  const addRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = addEmail.trim().toLowerCase();
    if (!email || addBusy) return;
    const usdRaw = addUsd.trim();
    const usdAmount = usdRaw === '' ? undefined : Number(usdRaw);
    if (usdAmount !== undefined && (!Number.isFinite(usdAmount) || usdAmount < 0)) {
      setLastSend({ kind: 'error', message: `Invalid grant value: ${usdRaw}` });
      return;
    }
    setAddBusy(true);
    try {
      const res = await addRelaunchRecipient({
        email,
        ...(usdAmount !== undefined ? { usdAmount } : {}),
        wasPayingUser: addPaying,
      });
      setLastSend({
        kind: 'success',
        message: res.created
          ? `Added ${email}${res.grantUsd != null ? ` with $${res.grantUsd} grant` : ''}.`
          : `Updated ${email}${res.grantUsd != null ? ` (grant $${res.grantUsd})` : ''}.`,
      });
      setAddEmail('');
      setAddPaying(false);
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add recipient.';
      setLastSend({ kind: 'error', message });
    } finally {
      setAddBusy(false);
    }
  };

  const removeRecipient = async (email: string) => {
    const ok = window.confirm(
      `Remove ${email} from the relaunch roster?\n\nThe recipient row will be deleted. An unclaimed signup grant for this email will also be removed. A grant that has already been claimed is preserved as an audit row.`,
    );
    if (!ok) return;
    setBusyRow(email);
    try {
      const res = await deleteRelaunchRecipient(email);
      setLastSend({
        kind: res.deleted ? 'success' : 'info',
        message: res.deleted
          ? `Removed ${email}${res.grantPreservedConsumed ? ' (claimed grant kept)' : ''}.`
          : `${email} was not in the roster.`,
      });
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove recipient.';
      setLastSend({ kind: 'error', message });
    } finally {
      setBusyRow(null);
    }
  };

  const togglePaying = async (email: string, next: boolean) => {
    setBusyRow(email);
    try {
      await updateRelaunchPaying({ email, wasPayingUser: next });
      setLastSend({
        kind: 'success',
        message: `${email} ${next ? 'marked as paying user' : 'unmarked as paying user'}.`,
      });
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update paying flag.';
      setLastSend({ kind: 'error', message });
    } finally {
      setBusyRow(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const showingFrom = total === 0 ? 0 : offset + 1;
  const showingTo = Math.min(offset + recipients.length, total);

  const pendingOnPage = useMemo(
    () => recipients.filter((r) => !r.sent).length,
    [recipients],
  );

  return (
    <S.Card>
      <S.SectionTitle>Old-user relaunch — send roster</S.SectionTitle>
      <S.Description>
        Rows imported from the original-Strive user list. Send in operator-driven batches.
        Template is chosen automatically per recipient — paying users get the founder-voiced
        thanks/apology, everyone else gets the standard relaunch. Mailjet sender reputation
        depends on warm-up, so start small (a few hundred a day) and watch bounce / spam.
      </S.Description>

      <S.Toolbar>
        <S.Stat>
          <strong>{pendingCount}</strong> pending
        </S.Stat>
        <S.Stat>
          <strong>{sentCount}</strong> sent
        </S.Stat>
        <S.Stat>
          <strong>{payingCount}</strong> paying
        </S.Stat>
        <S.Stat>
          <strong>{signedUpCount}</strong> signed up
        </S.Stat>
        <span style={{ flex: 1 }} />
        {STATUS_FILTERS.map((f) => (
          <S.FilterButton
            key={f.key}
            $active={statusFilter === f.key}
            onClick={() => {
              setStatusFilter(f.key);
              setOffset(0);
            }}
          >
            {f.label}
          </S.FilterButton>
        ))}
        <S.FilterButton
          $active={payingOnly}
          onClick={() => {
            setPayingOnly((v) => !v);
            setOffset(0);
          }}
        >
          Paying only
        </S.FilterButton>
      </S.Toolbar>

      <S.SearchRow>
        <S.SearchInput
          type="search"
          placeholder="Search email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <S.RowButton type="button" onClick={() => setQuery('')}>
            Clear
          </S.RowButton>
        )}
      </S.SearchRow>

      <S.AddRow as="form" onSubmit={addRecipient}>
        <S.FieldLabel>Add recipient</S.FieldLabel>
        <S.AddInputs>
          <S.SearchInput
            type="email"
            placeholder="email@example.com"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            disabled={addBusy}
            required
          />
          <S.InlineLabel>Grant $</S.InlineLabel>
          <S.SmallInput
            type="number"
            min={0}
            max={1000}
            step={1}
            value={addUsd}
            onChange={(e) => setAddUsd(e.target.value)}
            disabled={addBusy}
          />
          <S.PayingToggle>
            <input
              type="checkbox"
              checked={addPaying}
              onChange={(e) => setAddPaying(e.target.checked)}
              disabled={addBusy}
            />
            <S.InlineLabel>Paying user</S.InlineLabel>
          </S.PayingToggle>
          <Button type="submit" disabled={addBusy || !addEmail.trim()}>
            {addBusy ? 'Adding…' : 'Add'}
          </Button>
        </S.AddInputs>
      </S.AddRow>

      <S.BatchControls>
        <S.InlineLabel>Batch:</S.InlineLabel>
        <S.SmallInput
          type="number"
          min={1}
          max={100}
          value={batchSize}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isFinite(next)) setBatchSize(Math.max(1, Math.min(100, next)));
          }}
          disabled={sending}
        />
        <Button
          type="button"
          onClick={sendBatch}
          disabled={sending || pendingOnPage === 0}
        >
          {sending ? 'Sending…' : `Send next ${Math.min(batchSize, pendingOnPage)} from this page`}
        </Button>
        {lastSend && <S.StatusLine $kind={lastSend.kind}>{lastSend.message}</S.StatusLine>}
      </S.BatchControls>

      <S.TableWrap>
        <S.Table>
          <thead>
            <tr>
              <S.Th>Email</S.Th>
              <S.Th>Status</S.Th>
              <S.Th>Paying</S.Th>
              <S.Th>Signed up</S.Th>
              <S.Th>Grant</S.Th>
              <S.Th>Sent at</S.Th>
              <S.Th>Action</S.Th>
            </tr>
          </thead>
          <tbody>
            {loading && recipients.length === 0 && (
              <tr>
                <S.Td colSpan={7} $muted>
                  Loading…
                </S.Td>
              </tr>
            )}
            {!loading && recipients.length === 0 && (
              <tr>
                <S.Td colSpan={7} $muted>
                  No recipients in this view.
                </S.Td>
              </tr>
            )}
            {recipients.map((r) => {
              const lastAction = rowStatus[r.email];
              const isSent = r.sent || lastAction === 'sent';
              const pillKind: 'pending' | 'sent' | 'failed' | 'skipped' = isSent
                ? 'sent'
                : lastAction === 'failed'
                  ? 'failed'
                  : lastAction === 'already_sent' || lastAction === 'not_in_list'
                    ? 'skipped'
                    : 'pending';
              const pillLabel = isSent
                ? 'Sent'
                : lastAction === 'failed'
                  ? 'Failed'
                  : lastAction === 'already_sent'
                    ? 'Already sent'
                    : lastAction === 'not_in_list'
                      ? 'Not in list'
                      : 'Pending';
              const rowBusy = busyRow === r.email;
              const isEditingGrant = editingGrantFor === r.email;
              return (
                <S.Tr key={r.email} $dimmed={isSent}>
                  <S.Td>{r.email}</S.Td>
                  <S.Td>
                    <S.Pill $kind={pillKind}>{pillLabel}</S.Pill>
                  </S.Td>
                  <S.Td>
                    <S.PayingToggle>
                      <input
                        type="checkbox"
                        checked={Boolean(r.wasPayingUser)}
                        onChange={(e) => togglePaying(r.email, e.target.checked)}
                        disabled={rowBusy || sending}
                      />
                      {r.wasPayingUser && <S.Pill $kind="paying">Paid</S.Pill>}
                    </S.PayingToggle>
                  </S.Td>
                  <S.Td $muted={!r.signedUp}>
                    {r.signedUp ? (
                      <S.Pill
                        $kind="signedUp"
                        title={r.signedUpAt ? new Date(r.signedUpAt).toLocaleString() : undefined}
                      >
                        Yes
                      </S.Pill>
                    ) : (
                      '—'
                    )}
                  </S.Td>
                  <S.Td $muted>
                    {isEditingGrant ? (
                      <S.InlineEdit>
                        <S.SmallInput
                          autoFocus
                          type="number"
                          min={0}
                          max={1000}
                          step={1}
                          value={editGrantValue}
                          onChange={(e) => setEditGrantValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveGrant(r.email);
                            if (e.key === 'Escape') setEditingGrantFor(null);
                          }}
                          disabled={rowBusy}
                        />
                        <S.RowButton type="button" onClick={() => saveGrant(r.email)} disabled={rowBusy}>
                          {rowBusy ? '…' : 'Save'}
                        </S.RowButton>
                        <S.RowButton
                          type="button"
                          onClick={() => setEditingGrantFor(null)}
                          disabled={rowBusy}
                        >
                          Cancel
                        </S.RowButton>
                      </S.InlineEdit>
                    ) : (
                      <S.GrantCell
                        $clickable={!r.grantConsumed}
                        title={
                          r.grantConsumed
                            ? 'Already claimed — cannot edit'
                            : 'Click to edit grant'
                        }
                        onClick={() => openGrantEdit(r)}
                      >
                        {r.grantUsd != null ? `$${r.grantUsd}` : '—'}
                        {r.grantConsumed && ' (claimed)'}
                      </S.GrantCell>
                    )}
                  </S.Td>
                  <S.Td $muted>{r.sentAt ? new Date(r.sentAt).toLocaleString() : '—'}</S.Td>
                  <S.Td>
                    <S.RowActions>
                      <S.RowButton
                        type="button"
                        onClick={() => sendOne(r.email)}
                        disabled={isSent || sending}
                      >
                        {isSent ? 'Sent' : 'Send'}
                      </S.RowButton>
                      <S.RemoveButton
                        type="button"
                        onClick={() => removeRecipient(r.email)}
                        disabled={rowBusy || sending}
                        title="Remove from roster"
                        aria-label={`Remove ${r.email}`}
                      >
                        ×
                      </S.RemoveButton>
                    </S.RowActions>
                  </S.Td>
                </S.Tr>
              );
            })}
          </tbody>
        </S.Table>
      </S.TableWrap>

      <S.Pagination>
        <span>
          Showing {showingFrom}–{showingTo} of {total}
        </span>
        <S.PageButtons>
          <S.RowButton
            type="button"
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
            disabled={offset === 0 || loading}
          >
            ← Prev
          </S.RowButton>
          <S.InlineLabel>
            Page {currentPage} / {totalPages}
          </S.InlineLabel>
          <S.RowButton
            type="button"
            onClick={() => setOffset(offset + PAGE_SIZE)}
            disabled={showingTo >= total || loading}
          >
            Next →
          </S.RowButton>
        </S.PageButtons>
      </S.Pagination>
    </S.Card>
  );
};
