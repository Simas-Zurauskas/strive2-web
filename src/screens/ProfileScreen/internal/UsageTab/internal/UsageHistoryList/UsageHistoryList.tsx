import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Button } from '@/components';
import { formatMicroCents } from '@/lib/formatCost';
import * as S from './UsageHistoryList.styles';
import type { UsageHistoryData, UsageEvent } from '@/api/routes/usage';

interface Props {
  data?: UsageHistoryData;
  loading: boolean;
  offset: number;
  onPrev: () => void;
  onNext: () => void;
}

const SERVICE_LABELS: Record<string, string> = {
  anthropic: 'Claude',
  bfl: 'Image',
  tavily: 'Search',
  jina: 'Fetch',
  judge0: 'Code',
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

const Row: React.FC<{ event: UsageEvent }> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const hasMetadata = Object.keys(event.metadata ?? {}).length > 0;

  return (
    <S.Row as={hasMetadata ? 'button' : 'div'} onClick={hasMetadata ? () => setOpen((o) => !o) : undefined} $expandable={hasMetadata}>
      <S.RowHeader>
        <S.ServiceBadge $service={event.service}>
          {SERVICE_LABELS[event.service] ?? event.service}
        </S.ServiceBadge>
        <S.Action>{event.action}</S.Action>
        <S.Time>{formatTime(event.timestamp)}</S.Time>
        <S.Cost>{formatMicroCents(event.costMicroCents)}</S.Cost>
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

export const UsageHistoryList: React.FC<Props> = ({ data, loading, offset, onPrev, onNext }) => {
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
