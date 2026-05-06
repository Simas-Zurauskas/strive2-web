'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMarketingPreference, updateMarketingPreference } from '@/api/routes/auth';
import { QKeys } from '@/types';
import * as S from './MarketingPreference.styles';

/**
 * Profile-page section for the "promotional emails" opt-in.
 *
 * Mailjet is the source of truth — this component reads/writes through
 * the API to a Mailjet contact list. The same Mailjet record is also
 * updated when a user clicks the unsubscribe link in any promotional
 * email, so the checkbox stays consistent with the email-link flow
 * without local sync.
 */
export const MarketingPreference: React.FC = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QKeys.MARKETING_PREFERENCE],
    queryFn: getMarketingPreference,
    // Marketing state changes infrequently and a stale read is benign
    // (worst case: the user sees yesterday's checkbox until they reload).
    // Don't refetch on every focus — Mailjet round-trips aren't free.
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: updateMarketingPreference,
    // Optimistic flip so the checkbox feels instant; rolled back if the
    // Mailjet write fails. Without this the checkbox lags one full
    // round-trip behind the click, which feels broken on a toggle.
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: [QKeys.MARKETING_PREFERENCE] });
      const prev = queryClient.getQueryData<{ subscribed: boolean }>([QKeys.MARKETING_PREFERENCE]);
      queryClient.setQueryData([QKeys.MARKETING_PREFERENCE], { subscribed: vars.subscribed });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData([QKeys.MARKETING_PREFERENCE], ctx.prev);
      toast.error('Could not update marketing preference');
    },
    onSuccess: (data) => {
      queryClient.setQueryData([QKeys.MARKETING_PREFERENCE], data);
    },
  });

  const subscribed = query.data?.subscribed ?? true;
  const disabled = query.isLoading || mutation.isPending;

  return (
    <S.Section>
      <S.SectionTitle>Email preferences</S.SectionTitle>
      <S.Description>
        Manage which Strive emails land in your inbox. Account messages — verification, password
        resets, security codes — always send and aren&apos;t controlled here.
      </S.Description>

      {query.isLoading ? (
        <S.Skeleton />
      ) : (
        <S.Row data-disabled={disabled}>
          <S.Checkbox
            checked={subscribed}
            disabled={disabled}
            onChange={(e) => mutation.mutate({ subscribed: e.target.checked })}
          />
          <S.RowText>
            <S.RowLabel>Promotional emails</S.RowLabel>
            <S.RowHint>
              Product updates, learning tips, and the occasional announcement. No more than a few a
              month.
            </S.RowHint>
          </S.RowText>
        </S.Row>
      )}
    </S.Section>
  );
};
