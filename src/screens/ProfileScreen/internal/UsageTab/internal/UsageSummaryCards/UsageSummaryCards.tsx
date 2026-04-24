import Skeleton from 'react-loading-skeleton';
import { formatMicroCents } from '@/lib/formatCost';
import * as S from './UsageSummaryCards.styles';
import type { UsageSummaryData } from '@/api/routes/usage';

interface Props {
  data?: UsageSummaryData;
  loading: boolean;
}

const SERVICE_LABELS: Record<string, string> = {
  anthropic: 'Claude',
  bfl: 'Images',
  tavily: 'Search',
  jina: 'Fetch',
  judge0: 'Code exec',
};

export const UsageSummaryCards: React.FC<Props> = ({ data, loading }) => {
  const cards = [
    { label: 'Today', value: data?.today.costMicroCents ?? 0 },
    { label: 'This month', value: data?.thisMonth.costMicroCents ?? 0 },
    { label: 'All time', value: data?.allTime.costMicroCents ?? 0 },
  ];

  const byService = (data?.byService ?? [])
    .filter((s) => s.costMicroCents > 0)
    .sort((a, b) => b.costMicroCents - a.costMicroCents);

  return (
    <>
      <S.Grid>
        {cards.map((c) => (
          <S.Card key={c.label}>
            <S.Value>{loading ? <Skeleton width={72} /> : formatMicroCents(c.value)}</S.Value>
            <S.Label>{c.label}</S.Label>
          </S.Card>
        ))}
      </S.Grid>

      {byService.length > 0 && (
        <S.ByService>
          <S.ByServiceTitle>Where it went</S.ByServiceTitle>
          <S.ChipRow>
            {byService.map((s) => (
              <S.Chip key={s.service}>
                <S.ChipService>{SERVICE_LABELS[s.service] ?? s.service}</S.ChipService>
                <S.ChipValue>{formatMicroCents(s.costMicroCents)}</S.ChipValue>
              </S.Chip>
            ))}
          </S.ChipRow>
        </S.ByService>
      )}
    </>
  );
};
