'use client';

import {
  Atom,
  BookOpen,
  Briefcase,
  Code,
  Compass,
  HeartPulse,
  Languages,
  Palette,
  Sparkles,
  Wrench,
} from 'lucide-react';
import * as S from './HomeCourseCard.styles';
import type { Course, CourseDomain } from '@/api/types';
import type { LucideIcon } from 'lucide-react';

interface HomeCourseCardProps {
  course: Pick<Course, '_id' | 'name' | 'slug' | 'domain' | 'structure' | 'updatedAt'>;
  /** Progress percentage 0–100. */
  progress?: number;
  onClick: () => void;
}

const relativeTime = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diffMs / 60000);
  const h = Math.floor(diffMs / 3_600_000);
  const d = Math.floor(diffMs / 86_400_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
};

/** First "real" letter of the course name — skips leading articles. */
const STOP_WORDS = new Set(['a', 'an', 'the', 'on', 'in', 'of', 'to', 'and']);
const courseInitial = (name?: string | null): string => {
  if (!name) return '·';
  const words = name
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
  for (const w of words) {
    if (!STOP_WORDS.has(w.toLowerCase())) return w.charAt(0).toUpperCase();
  }
  return words[0]?.charAt(0).toUpperCase() ?? '·';
};

const DOMAIN_LABEL: Record<CourseDomain, string> = {
  programming: 'Code',
  stem: 'STEM',
  humanities: 'Humanities',
  language: 'Language',
  creative: 'Creative',
  business: 'Business',
  practical: 'Practical',
  'practical-ai': 'AI',
  'life-skills': 'Life skills',
  other: 'Course',
};

const DOMAIN_ICON: Record<CourseDomain, LucideIcon> = {
  programming: Code,
  stem: Atom,
  humanities: BookOpen,
  language: Languages,
  creative: Palette,
  business: Briefcase,
  practical: Wrench,
  'practical-ai': Sparkles,
  'life-skills': HeartPulse,
  other: Compass,
};

export const HomeCourseCard = ({ course, progress, onClick }: HomeCourseCardProps) => {
  const moduleCount = course.structure?.modules?.length ?? 0;
  const lessonCount =
    course.structure?.modules?.reduce((sum, mod) => sum + (mod.lessons?.length ?? 0), 0) ?? 0;
  const initial = courseInitial(course.name);
  const domainKey = course.domain ?? 'other';
  const domainLabel = DOMAIN_LABEL[domainKey];
  const Icon = DOMAIN_ICON[domainKey];
  const gradient = S.pickDomainGradient(domainKey, course._id);

  return (
    <S.Container $gradient={gradient} onClick={onClick} aria-label={`Open ${course.name}`}>
      <S.TopRow>
        <S.DomainMark>
          <Icon />
          {domainLabel}
        </S.DomainMark>
        <S.Initial aria-hidden>{initial}</S.Initial>
      </S.TopRow>

      <S.Body>
        <S.Title>{course.name || 'Untitled course'}</S.Title>
        <S.Meta>
          {moduleCount > 0 && (
            <>
              <span>
                {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
              </span>
              <S.MetaSep />
            </>
          )}
          <span>{relativeTime(course.updatedAt)}</span>
        </S.Meta>
        <S.Progress>
          <S.ProgressFill $percent={progress ?? 0} />
        </S.Progress>
      </S.Body>
    </S.Container>
  );
};
