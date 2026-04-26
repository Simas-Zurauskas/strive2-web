'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { updatePreferences } from '@/api/routes/auth';
import { getNarrationVoices } from '@/api/routes/course';
import { useAuth } from '@/hooks';
import { QKeys } from '@/types';
import * as S from './NarrationPreferences.styles';

const PRESET_RATES = [0.85, 1.0, 1.15, 1.25, 1.5] as const;

/**
 * Profile-page section for the user's lesson-narration defaults. Voice
 * and speaking rate live on `user.preferences.{narrationVoice,
 * narrationRate}`. The lesson narration job uses these as fallbacks when
 * no per-lesson override is sent.
 *
 * Empty `narrationVoice` is the explicit "no preference" sentinel — the
 * server resolves to the catalog default at synthesis time.
 */
export const NarrationPreferences = () => {
  const { user, refetchAuthUser } = useAuth();
  const queryClient = useQueryClient();

  const voicesQuery = useQuery({
    queryKey: [QKeys.NARRATION_VOICES],
    queryFn: getNarrationVoices,
    staleTime: Infinity,
  });

  const [pendingVoiceId, setPendingVoiceId] = useState<string | null>(null);
  const [pendingRate, setPendingRate] = useState<number | null>(null);

  const updateMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      refetchAuthUser();
      queryClient.invalidateQueries({ queryKey: [QKeys.AUTH_USER] });
    },
    onError: () => toast.error('Could not save narration preference'),
  });

  if (!user) return null;

  const currentVoice = user.preferences?.narrationVoice ?? '';
  const currentRate = user.preferences?.narrationRate ?? 1.0;

  const handlePickVoice = (voiceId: string) => {
    if (voiceId === currentVoice) return;
    setPendingVoiceId(voiceId);
    updateMutation.mutate(
      { narrationVoice: voiceId },
      { onSettled: () => setPendingVoiceId(null) },
    );
  };

  const handleClearVoice = () => {
    if (currentVoice === '') return;
    setPendingVoiceId('');
    updateMutation.mutate(
      { narrationVoice: '' },
      { onSettled: () => setPendingVoiceId(null) },
    );
  };

  const handlePickRate = (rate: number) => {
    if (Math.abs(rate - currentRate) < 0.01) return;
    setPendingRate(rate);
    updateMutation.mutate(
      { narrationRate: rate },
      { onSettled: () => setPendingRate(null) },
    );
  };

  return (
    <S.Section>
      <S.SectionTitle>Lesson narration</S.SectionTitle>
      <S.Description>
        Your default voice and speaking rate for audio narration. Each lesson can override
        these from the player.
      </S.Description>

      <S.SubsectionLabel>Voice</S.SubsectionLabel>
      <S.VoiceList>
        <S.VoiceCard
          $selected={currentVoice === ''}
          onClick={handleClearVoice}
          disabled={updateMutation.isPending}
          type="button"
        >
          <S.VoiceMain>
            <S.VoiceLabel>System default</S.VoiceLabel>
            <S.VoiceDescription>
              Whatever we recommend. Updates as we add new voices.
            </S.VoiceDescription>
          </S.VoiceMain>
          <S.SelectionIndicator $selected={currentVoice === ''}>
            {currentVoice === '' && <Check size={12} strokeWidth={3} />}
          </S.SelectionIndicator>
        </S.VoiceCard>
        {(voicesQuery.data?.voices ?? []).map((v) => {
          const isSelected = currentVoice === v.id;
          const isPending = pendingVoiceId === v.id && updateMutation.isPending;
          return (
            <S.VoiceCard
              key={v.id}
              $selected={isSelected}
              onClick={() => handlePickVoice(v.id)}
              disabled={updateMutation.isPending}
              type="button"
            >
              <S.VoiceMain>
                <S.VoiceLabel>{v.label}</S.VoiceLabel>
                <S.VoiceDescription>{v.description}</S.VoiceDescription>
              </S.VoiceMain>
              {isPending ? (
                <S.PendingDot />
              ) : (
                <S.SelectionIndicator $selected={isSelected}>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </S.SelectionIndicator>
              )}
            </S.VoiceCard>
          );
        })}
      </S.VoiceList>

      <S.SubsectionLabel>Speaking rate</S.SubsectionLabel>
      <S.RateRow>
        {PRESET_RATES.map((rate) => {
          const active = Math.abs(rate - currentRate) < 0.01;
          const pending = pendingRate === rate && updateMutation.isPending;
          return (
            <S.RateButton
              key={rate}
              $active={active}
              onClick={() => handlePickRate(rate)}
              disabled={updateMutation.isPending}
              type="button"
            >
              {pending ? '…' : `${rate}×`}
            </S.RateButton>
          );
        })}
      </S.RateRow>
    </S.Section>
  );
};
