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
  // Each card shows two numbers: charged (what the user paid in credits-equivalent
  // microcents) and vendor (what we paid the provider). They differ for the four
  // marked-up services (judge0, tavily, jina, bfl); for anthropic-only periods
  // they're equal and the vendor line is hidden.
  const cards = [
    {
      label: 'Today',
      charged: data?.today.chargedMicroCents ?? 0,
      vendor: data?.today.costMicroCents ?? 0,
    },
    {
      label: 'This month',
      charged: data?.thisMonth.chargedMicroCents ?? 0,
      vendor: data?.thisMonth.costMicroCents ?? 0,
    },
    {
      label: 'All time',
      charged: data?.allTime.chargedMicroCents ?? 0,
      vendor: data?.allTime.costMicroCents ?? 0,
    },
  ];

  const byService = (data?.byService ?? [])
    .filter((s) => s.chargedMicroCents > 0 || s.costMicroCents > 0)
    .sort((a, b) => b.chargedMicroCents - a.chargedMicroCents);

  return (
    <>
      <S.Grid>
        {cards.map((c) => (
          <S.Card key={c.label}>
            <S.Value>{loading ? <Skeleton width={72} /> : formatMicroCents(c.charged)}</S.Value>
            {!loading && c.vendor !== c.charged && (
              <S.VendorValue title="Vendor cost (what we paid the provider)">
                vendor {formatMicroCents(c.vendor)}
              </S.VendorValue>
            )}
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
                <S.ChipValue>{formatMicroCents(s.chargedMicroCents)}</S.ChipValue>
                {s.chargedMicroCents !== s.costMicroCents && (
                  <S.ChipService title="Vendor cost (what we paid the provider)">
                    / vendor {formatMicroCents(s.costMicroCents)}
                  </S.ChipService>
                )}
              </S.Chip>
            ))}
          </S.ChipRow>
        </S.ByService>
      )}
    </>
  );
};
