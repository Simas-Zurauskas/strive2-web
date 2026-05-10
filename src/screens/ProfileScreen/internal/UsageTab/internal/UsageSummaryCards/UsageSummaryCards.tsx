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
  // Each card stacks three numbers: credits debited (big, integer count),
  // charged (small, vendor cost × markup in $), vendor (small, raw provider
  // spend in $). Credits come from CreditLedger `debit_action` rows — true
  // balance debit, not derived from charged microcents — so it accounts for
  // per-job ceil and balance-clamp differences. The vendor subline is hidden
  // when it equals charged (anthropic-only periods have no markup gap).
  const cards = [
    {
      label: 'Today',
      credits: data?.today.creditsDebited ?? 0,
      charged: data?.today.chargedMicroCents ?? 0,
      vendor: data?.today.costMicroCents ?? 0,
    },
    {
      label: 'This month',
      credits: data?.thisMonth.creditsDebited ?? 0,
      charged: data?.thisMonth.chargedMicroCents ?? 0,
      vendor: data?.thisMonth.costMicroCents ?? 0,
    },
    {
      label: 'All time',
      credits: data?.allTime.creditsDebited ?? 0,
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
            <S.Value>
              {loading ? <Skeleton width={72} /> : `${c.credits.toLocaleString()} cr`}
            </S.Value>
            {!loading && (
              <S.VendorValue title="What the user was charged (vendor × markup)">
                charged {formatMicroCents(c.charged)}
              </S.VendorValue>
            )}
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
