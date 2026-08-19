'use client';

import { AnimatePresence } from 'framer-motion';
import { Check, Expand, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Markdown } from '@/components/Markdown';
import { useScrollLock } from '@/hooks';
import { PANEL_CLOSE_TRANSITION, PANEL_OPEN_TRANSITION } from '@/theme/motionPresets';
import * as S from './AnnouncementsPanel.styles';
import { ImageLightbox, type LightboxImage } from './internal/ImageLightbox';
import type { Announcement } from '@/lib/announcements/list';

interface AnnouncementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Already sorted newest-first by the hook. */
  list: readonly Announcement[];
  /** Per-entry marks, held at their at-open value until close. */
  entryStates: { key: string; seen: boolean }[];
}

const formatDate = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

// Announcements are written by us and are the one place in the app where a
// link is near-certain. Left to itself `react-markdown` renders a bare <a>,
// which would full-page-load an internal route out of the app and open an
// external one in the same tab. Internal links route through next/link and
// close the panel on the way; external links open in a new tab, and get
// `rel="noopener noreferrer"` because `target="_blank"` without it hands the
// opened page a live `window.opener` reference.
const markdownComponents = (onNavigate: () => void): Parameters<typeof Markdown>[0]['components'] => ({
  a: ({ href, children }) => {
    const to = href ?? '';
    if (to.startsWith('/')) {
      return (
        <Link href={to} onClick={onNavigate}>
          {children}
        </Link>
      );
    }
    return (
      <a href={to} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
});

export const AnnouncementsPanel = ({
  isOpen,
  onClose,
  list,
  entryStates,
}: AnnouncementsPanelProps) => {
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // A lightbox left open behind a closed panel would spring back the next time
  // the panel opens. The panel can be closed from outside this component — the
  // navbar closes it on a route change — so clearing it in the local close
  // handler alone would not cover every path.
  //
  // Same shape, and same rule suppression, as the two resets in
  // `components/Navbar/Navbar.tsx:85` and `:163`: the state is local UI state
  // that is not derivable from `isOpen` alone, and resetting it when the panel
  // closes is precisely the intent.
  useEffect(() => {
    if (!isOpen) setLightbox(null); // eslint-disable-line react-hooks/set-state-in-effect -- reset on panel close is the intent
  }, [isOpen]);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const seenByKey = new Map(entryStates.map((s) => [s.key, s.seen]));

  return (
    <>
      <S.Backdrop $open={isOpen} onClick={onClose} aria-hidden="true" />
      <AnimatePresence>
        {isOpen && (
          <S.Panel
            role="dialog"
            aria-modal="true"
            aria-label="Announcements"
            initial={{ x: '100%' }}
            animate={{ x: 0, transition: PANEL_OPEN_TRANSITION }}
            exit={{ x: '100%', transition: PANEL_CLOSE_TRANSITION }}
          >
            <S.Header>
              <S.HeaderText>
                <S.Eyebrow>What&rsquo;s new</S.Eyebrow>
                <S.Title>Announcements</S.Title>
              </S.HeaderText>
              <S.CloseButton type="button" onClick={onClose} aria-label="Close announcements">
                <X />
              </S.CloseButton>
            </S.Header>

            <S.HeaderRule />

            <S.Body>
              {list.length === 0 ? (
                <S.Empty>Nothing to report just yet.</S.Empty>
              ) : (
                <S.Trail>
                  {list.map((a) => {
                    const seen = seenByKey.get(a.key) ?? true;
                    return (
                      <S.Entry key={a.key}>
                        <S.Seal $unseen={!seen} aria-hidden="true">
                          {seen ? <Check /> : <S.SealPip />}
                        </S.Seal>
                        <S.Content>
                          <S.EntryMeta>
                            <S.EntryDate dateTime={a.date}>{formatDate(a.date)}</S.EntryDate>
                            {!seen && <S.NewTag>New</S.NewTag>}
                          </S.EntryMeta>
                          <S.EntryTitle>{a.title}</S.EntryTitle>
                          {a.image && (
                            <S.Figure
                              type="button"
                              onClick={() => setLightbox(a.image ?? null)}
                              aria-label={`Expand image: ${a.image.alt}`}
                            >
                              <Image
                                src={a.image.src}
                                alt={a.image.alt}
                                width={a.image.width}
                                height={a.image.height}
                                sizes="(max-width: 480px) 92vw, 380px"
                              />
                              <S.ExpandHint aria-hidden="true">
                                <Expand />
                              </S.ExpandHint>
                            </S.Figure>
                          )}
                          <S.EntryBody>
                            <Markdown components={markdownComponents(onClose)}>{a.body}</Markdown>
                          </S.EntryBody>
                        </S.Content>
                      </S.Entry>
                    );
                  })}
                </S.Trail>
              )}
            </S.Body>
          </S.Panel>
        )}
      </AnimatePresence>
      <ImageLightbox image={lightbox} onClose={closeLightbox} />
    </>
  );
};
