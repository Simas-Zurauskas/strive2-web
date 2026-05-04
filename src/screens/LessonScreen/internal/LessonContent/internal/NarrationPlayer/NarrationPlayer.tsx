'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Headphones, Pause, Play, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { deleteLessonNarration, generateLessonNarration, getNarrationVoices } from '@/api/routes/course';
import { DropdownMenu } from '@/components';
import { TOASTS, toastMessage } from '@/constants/toasts';
import { useAuth, useJobManager } from '@/hooks';
import { useSocket } from '@/hooks/useSocket';
import { QKeys } from '@/types';
import * as S from './NarrationPlayer.styles';
import type { JobProgressEvent, JobStatusEvent } from '@/api/types';

const PLAYBACK_RATES = [1, 1.25, 1.5, 1.75, 2] as const;

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  // Pad minutes to 2 digits so the time display is a fixed character
  // width regardless of duration — stops the scrub bar from twitching
  // every time the player crosses 10:00.
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

interface NarrationPlayerProps {
  courseId: string;
  moduleIndex: number;
  lessonIndex: number;
  audioUrl: string | null;
  audioVoice: string | null;
  hasContent: boolean;
}

export const NarrationPlayer = ({
  courseId,
  moduleIndex,
  lessonIndex,
  audioUrl,
  audioVoice,
  hasContent,
}: NarrationPlayerProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { trackJob } = useJobManager();
  const { socket } = useSocket();

  // "We just submitted a job and are waiting for the audioUrl to arrive."
  // Stored as the ID of the job we kicked off. Clears the moment we
  // observe a populated audioUrl on the next render — derived, not via
  // an effect, so the React 19 setState-in-effect lint stays happy.
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);
  const isGenerating = !!pendingJobId && !audioUrl;
  if (pendingJobId && audioUrl) {
    // Setting state during render is fine when guarded — React batches
    // it as part of the current commit rather than scheduling another.
    setPendingJobId(null);
  }

  // Listen for OUR specific narration job's completion. We don't piggy-back
  // on JobManager's invalidation alone because polling stops the instant
  // course.activeJobId clears (which JobManager does first) — that can
  // cancel an in-flight lesson refetch and let the cache-level invalidate
  // coalesce with the dead request, leaving stale data on screen until
  // the user reloads. This effect:
  //   - on `failed`: clears pendingJobId so the dots stop and we drop
  //     back to the empty Generate state.
  //   - on `completed`: refetches the lesson directly and clears
  //     pendingJobId once the new audioUrl is in cache. Re-running the
  //     fetch via refetchQueries (rather than invalidate) bypasses any
  //     deduplication with the cancelled poll.
  useEffect(() => {
    if (!socket || !pendingJobId) return;
    const handleStatus = (event: JobStatusEvent) => {
      if (event.jobId !== pendingJobId) return;
      if (event.status === 'failed') {
        setPendingJobId(null);
        return;
      }
      if (event.status === 'completed') {
        queryClient
          .refetchQueries({
            queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex],
          })
          .finally(() => setPendingJobId(null));
      }
    };
    socket.on('job:status', handleStatus);
    return () => {
      socket.off('job:status', handleStatus);
    };
  }, [socket, pendingJobId, queryClient, courseId, moduleIndex, lessonIndex]);

  // Listen for narration_ready progress to surface cache hits. Without
  // this signal, "Clear → Generate" with unchanged settings looks broken
  // — same audio reappears in ~1s because the file is content-hash-keyed
  // and shared across users (intentional dedup, but invisible to users).
  // We deliberately don't toast about it — the audio simply starts playing,
  // which is itself the confirmation. Telling the user about cache hits is
  // dev-think, not user-think.

  // Voice catalog is fetched lazily, only when we need to display the
  // currently-active voice's friendly label in the player eyebrow.
  // Voice selection itself lives in profile settings — the lesson
  // player just shows what's playing.
  const voicesQuery = useQuery({
    queryKey: [QKeys.NARRATION_VOICES],
    queryFn: getNarrationVoices,
    enabled: !!audioVoice,
    staleTime: Infinity,
  });

  // ── Generate / clear mutations ───────────────────────
  const generateMutation = useMutation({
    // Always uses the user's saved preference — no per-lesson override
    // from the player UI. Profile is the single source of truth for voice.
    mutationFn: () => generateLessonNarration({ courseId, moduleIndex, lessonIndex, body: {} }),
    onSuccess: ({ jobId }) => {
      setPendingJobId(jobId);
      trackJob({ jobId, courseId, type: 'lesson_narration' });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : '';
      toast.error(toastMessage({ dynamic: message, fallback: TOASTS.GENERATION_FAILED_RETRY }));
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => deleteLessonNarration({ courseId, moduleIndex, lessonIndex }),
    onSuccess: () => {
      // refetchQueries (not invalidate) for the exact key — the same
      // in-flight-coalescing guard we use on completion: ensures the
      // refetch actually fires and surfaces the cleared audioUrl.
      queryClient.refetchQueries({
        queryKey: [QKeys.LESSON_CONTENT, courseId, moduleIndex, lessonIndex],
      });
      toast('Narration removed from this lesson.');
    },
    onError: () => {
      toast.error('Could not remove narration. Please try again.');
    },
  });

  // ── <audio> element wiring ───────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Initial playback rate seeds from the user's saved preference. After
  // mount the rate button is the source of truth — we don't sync further
  // changes back from the profile page.
  const [playbackRate, setPlaybackRate] = useState<number>(user?.preferences?.narrationRate ?? 1);

  // Persist playback position per lesson so users can leave the tab and
  // come back without losing their place. Keyed by lesson coords (not the
  // S3 URL — that rotates on regenerate).
  const positionKey = `strive:narration-pos:${courseId}:${moduleIndex}:${lessonIndex}`;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = playbackRate;
  }, [playbackRate]);

  // Sync duration + restore saved position. We can't rely solely on the JSX
  // onLoadedMetadata or a listener attached in this effect: when the user
  // navigates away and back, the audio file is HTTP-cached, the element
  // remounts, and the loadedmetadata event can fire before any listener is
  // attached. Without this, `duration` stays 0 — the scrub bar's max is 0,
  // so clicks on the track go nowhere.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    const apply = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
      }
      const saved = parseFloat(localStorage.getItem(positionKey) ?? 'NaN');
      if (Number.isFinite(saved) && saved > 0 && saved < (el.duration || 0) - 1) {
        el.currentTime = saved;
        setCurrentTime(saved);
      }
    };
    if (el.readyState >= 1) {
      apply();
      return;
    }
    el.addEventListener('loadedmetadata', apply);
    return () => el.removeEventListener('loadedmetadata', apply);
  }, [audioUrl, positionKey]);

  // ── Handlers ────────────────────────────────────────
  const handlePlayPause = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const target = Number(e.target.value);
    el.currentTime = target;
    setCurrentTime(target);
  };

  const handleRateClick = () => {
    const idx = PLAYBACK_RATES.indexOf(playbackRate as (typeof PLAYBACK_RATES)[number]);
    const next = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length];
    setPlaybackRate(next);
  };

  const handleClear = () => clearMutation.mutate();
  const handleGenerate = () => generateMutation.mutate();

  // Voice currently in use, for the player eyebrow.
  const currentVoiceLabel = useMemo(() => {
    if (!audioVoice) return null;
    const v = voicesQuery.data?.voices.find((x) => x.id === audioVoice);
    return v?.label ?? audioVoice;
  }, [audioVoice, voicesQuery.data]);

  // Voice-mismatch detection. Only meaningful once the user has both an
  // active audio AND a saved preference, and the two differ. Empty string
  // means "no saved preference" — server falls back to catalog default,
  // so we don't flag a mismatch for that.
  const userPrefVoice = user?.preferences?.narrationVoice ?? '';
  const voiceMismatch = !!(audioVoice && userPrefVoice && audioVoice !== userPrefVoice);
  const userPrefVoiceLabel = useMemo(() => {
    if (!userPrefVoice) return null;
    const v = voicesQuery.data?.voices.find((x) => x.id === userPrefVoice);
    return v?.label ?? userPrefVoice;
  }, [userPrefVoice, voicesQuery.data]);

  // Apply the new voice = clear current + regenerate. Two-step so the
  // server recomputes the content hash with the new voice id; otherwise
  // it would just hit the same cached file.
  const handleApplyNewVoice = async () => {
    await clearMutation.mutateAsync();
    generateMutation.mutate();
  };

  // Don't render at all on lessons with no narratable content.
  if (!hasContent) return null;

  // ── Empty state: prompt to generate ────────────────
  if (!audioUrl && !isGenerating) {
    return (
      <S.EmptyContainer initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <S.EmptyIcon>
          <Headphones size={16} />
        </S.EmptyIcon>
        <S.EmptyBody>
          <S.EmptyEyebrow>Audio narration</S.EmptyEyebrow>
          <S.EmptyTitle>Listen to this lesson</S.EmptyTitle>
        </S.EmptyBody>
        <S.PrimaryButton onClick={handleGenerate} disabled={generateMutation.isPending} type="button">
          {generateMutation.isPending ? 'Starting…' : 'Generate'}
        </S.PrimaryButton>
      </S.EmptyContainer>
    );
  }

  // ── Generating state ────────────────────────────────
  if (isGenerating) {
    return (
      <S.EmptyContainer initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <S.EmptyIcon>
          <Volume2 size={16} />
        </S.EmptyIcon>
        <S.EmptyBody>
          <S.EmptyEyebrow>Generating narration</S.EmptyEyebrow>
          <S.GeneratingDots>
            <span />
            <span />
            <span />
          </S.GeneratingDots>
        </S.EmptyBody>
      </S.EmptyContainer>
    );
  }

  // ── Ready state: full player ────────────────────────
  return (
    <S.PlayerStack>
      <AnimatePresence mode="wait">
        <S.PlayerContainer
          key="ready"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <audio
            ref={audioRef}
            src={audioUrl ?? undefined}
            preload="metadata"
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              const t = e.currentTarget.currentTime;
              setCurrentTime(t);
              const sec = Math.floor(t);
              if (sec % 5 === 0) localStorage.setItem(positionKey, String(t));
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              localStorage.removeItem(positionKey);
            }}
          />
          <S.PlayButton
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
            $playing={isPlaying}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </S.PlayButton>
          <S.PlayerBody>
            <S.PlayerEyebrow>
              {currentVoiceLabel ? `Narrating · ${currentVoiceLabel}` : 'Narration'}
            </S.PlayerEyebrow>
            <S.ScrubRow>
              <S.Scrub
                type="range"
                min={0}
                max={duration || 0}
                step={0.5}
                value={currentTime}
                onChange={handleScrub}
                aria-label="Seek narration"
                $progress={duration > 0 ? (currentTime / duration) * 100 : 0}
              />
              <S.Time>
                {formatTime(currentTime)} <span>/</span> {formatTime(duration)}
              </S.Time>
            </S.ScrubRow>
          </S.PlayerBody>
          <S.RateButton onClick={handleRateClick} aria-label="Playback speed" type="button">
            {playbackRate}×
          </S.RateButton>
          <DropdownMenu
            items={[
              {
                label: 'Remove from this lesson',
                variant: 'danger',
                onClick: handleClear,
              },
            ]}
          />
        </S.PlayerContainer>
      </AnimatePresence>
      {voiceMismatch && (
        <S.MismatchBanner initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <S.MismatchText>
            You changed your voice to <strong>{userPrefVoiceLabel}</strong>. This lesson is still on {currentVoiceLabel}
            .
          </S.MismatchText>
          <S.MismatchAction
            onClick={handleApplyNewVoice}
            disabled={clearMutation.isPending || generateMutation.isPending}
            type="button"
          >
            Regenerate with {userPrefVoiceLabel?.split(' ')[0] ?? 'new voice'}
          </S.MismatchAction>
        </S.MismatchBanner>
      )}
    </S.PlayerStack>
  );
};
