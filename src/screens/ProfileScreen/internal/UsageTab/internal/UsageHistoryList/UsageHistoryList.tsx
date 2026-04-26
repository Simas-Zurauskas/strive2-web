import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Button } from '@/components';
import { formatMicroCents } from '@/lib/formatCost';
import * as S from './UsageHistoryList.styles';
import type { UsageHistoryData, UsageEvent } from '@/api/routes/usage';
import type { UsageSortDir, UsageSortField } from '@/api/routes/usage';

interface Props {
  data?: UsageHistoryData;
  loading: boolean;
  offset: number;
  onPrev: () => void;
  onNext: () => void;
  sortBy: UsageSortField;
  sortDir: UsageSortDir;
  onSortChange: (field: UsageSortField) => void;
}

const SERVICE_LABELS: Record<string, string> = {
  anthropic: 'Claude',
  bfl: 'Image',
  tavily: 'Search',
  jina: 'Fetch',
  judge0: 'Code',
};

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  studio: 'Studio',
};

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Reuse formatMicroCents for USD by converting dollars → microcents (1¢ = 10,000 μ¢, $1 = 1,000,000 μ¢).
const formatUsd = (usd: number): string => formatMicroCents(usd * 1_000_000);

const planCellLabel = (event: UsageEvent): { label: string; kind: 'allowance' | 'topup' | 'mixed' | 'none' } => {
  if (event.source === 'topup') return { label: 'Top-up', kind: 'topup' };
  if (event.source === 'mixed') return { label: 'Mixed', kind: 'mixed' };
  if (event.source === 'allowance') {
    const planLabel = event.planAtTime ? PLAN_LABELS[event.planAtTime] ?? event.planAtTime : 'Plan';
    return { label: planLabel, kind: 'allowance' };
  }
  // No debit attribution yet (in-flight or failed job, or legacy row).
  return { label: '—', kind: 'none' };
};

interface ColumnDef {
  key: UsageSortField | null; // null => not sortable
  label: string;
  align: 'left' | 'right';
}

const COLUMNS: ColumnDef[] = [
  { key: 'service', label: 'Service', align: 'left' },
  { key: null, label: 'Action', align: 'left' },
  { key: 'timestamp', label: 'Time', align: 'left' },
  { key: 'costMicroCents', label: 'Vendor', align: 'right' },
  { key: 'chargedMicroCents', label: 'Credits', align: 'right' },
  { key: null, label: 'Plan', align: 'left' },
  { key: null, label: 'You pay', align: 'right' },
];

const SortHeader: React.FC<{
  sortBy: UsageSortField;
  sortDir: UsageSortDir;
  onSortChange: (field: UsageSortField) => void;
}> = ({ sortBy, sortDir, onSortChange }) => (
  <S.HeaderRow>
    {COLUMNS.map(({ key, label, align }) => {
      const active = key === sortBy;
      const sortable = key !== null;
      return (
        <S.HeaderCell
          key={label}
          type="button"
          $sortable={sortable}
          $active={active}
          $align={align}
          onClick={sortable ? () => onSortChange(key) : undefined}
          aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
        >
          {label}
          {active && <S.SortChevron $dir={sortDir}>▾</S.SortChevron>}
        </S.HeaderCell>
      );
    })}
  </S.HeaderRow>
);

const Row: React.FC<{ event: UsageEvent }> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const hasMetadata = Object.keys(event.metadata ?? {}).length > 0;
  const markedUp = event.chargedMicroCents !== event.costMicroCents;
  const plan = planCellLabel(event);
  const credits = event.creditsCharged;

  return (
    <S.Row
      as={hasMetadata ? 'button' : 'div'}
      onClick={hasMetadata ? () => setOpen((o) => !o) : undefined}
      $expandable={hasMetadata}
    >
      <S.RowHeader>
        <S.ServiceBadge $service={event.service}>
          {SERVICE_LABELS[event.service] ?? event.service}
        </S.ServiceBadge>
        <S.Action>{event.action}</S.Action>
        <S.Time>{formatTime(event.timestamp)}</S.Time>
        <S.VendorCost title="Vendor cost (what we paid the provider)">
          {formatMicroCents(event.costMicroCents)}
          {markedUp && (
            <>
              {' '}
              <S.Muted>(2×)</S.Muted>
            </>
          )}
        </S.VendorCost>
        <S.CreditsCell title="Decimal credits this row was worth">
          {credits > 0 ? credits.toFixed(2) : <S.Muted>—</S.Muted>}
        </S.CreditsCell>
        <S.PlanCell $kind={plan.kind}>{plan.label}</S.PlanCell>
        <S.Cost>{event.userPaidUsd === null ? <S.Muted>—</S.Muted> : formatUsd(event.userPaidUsd)}</S.Cost>
      </S.RowHeader>
      {open && hasMetadata && (
        <S.Metadata>
          {Object.entries(event.metadata).map(([k, v]) => (
            <S.MetadataRow key={k}>
              <S.MetadataKey>{k}</S.MetadataKey>
              <S.MetadataValue>
                {typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
                  ? String(v)
                  : JSON.stringify(v)}
              </S.MetadataValue>
            </S.MetadataRow>
          ))}
        </S.Metadata>
      )}
    </S.Row>
  );
};

export const UsageHistoryList: React.FC<Props> = ({
  data,
  loading,
  offset,
  onPrev,
  onNext,
  sortBy,
  sortDir,
  onSortChange,
}) => {
  const events = data?.events ?? [];
  const total = data?.total ?? 0;
  const hasPrev = offset > 0;
  const hasMore = data?.hasMore ?? false;

  return (
    <S.Section>
      <S.Header>
        <S.Title>Paid actions</S.Title>
        {data && (
          <S.Range>
            {total === 0 ? 'No activity yet' : `${offset + 1}–${offset + events.length} of ${total}`}
          </S.Range>
        )}
      </S.Header>

      <SortHeader sortBy={sortBy} sortDir={sortDir} onSortChange={onSortChange} />

      {loading && events.length === 0 && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <S.SkeletonRow key={i}>
              <Skeleton height={16} />
            </S.SkeletonRow>
          ))}
        </>
      )}

      {!loading && events.length === 0 && (
        <S.Empty>
          Once you start creating courses or running code exercises, each paid action (LLM call, image, search, execution) will appear here with its cost.
        </S.Empty>
      )}

      {events.map((e) => (
        <Row key={e.id} event={e} />
      ))}

      {(hasPrev || hasMore) && (
        <S.Pager>
          <Button variant="secondary" size="small" onClick={onPrev} disabled={!hasPrev || loading}>
            Previous
          </Button>
          <Button variant="secondary" size="small" onClick={onNext} disabled={!hasMore || loading}>
            Next
          </Button>
        </S.Pager>
      )}
    </S.Section>
  );
};
