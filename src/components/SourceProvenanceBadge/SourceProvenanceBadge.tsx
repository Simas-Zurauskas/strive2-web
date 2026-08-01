'use client';

import { FileText } from 'lucide-react';
import * as S from './SourceProvenanceBadge.styles';

interface SourceProvenanceBadgeProps {
  /**
   * When true, renders the muted "AI-supplemented" text label instead of
   * the gold "From your documents" pill. Binary provenance per the
   * documents-course plan — no percentages.
   */
  aiSupplemented?: boolean;
}

/**
 * Per-lesson provenance marker for courses built from user documents.
 * Lessons whose structure entry carries `sourceRefs` are grounded in the
 * uploaded corpus ("From your documents"); lessons without are generated
 * by the model around them ("AI-supplemented").
 */
export const SourceProvenanceBadge = ({ aiSupplemented = false }: SourceProvenanceBadgeProps) => {
  if (aiSupplemented) {
    return <S.SupplementedLabel>AI-supplemented</S.SupplementedLabel>;
  }
  return (
    <S.DocumentsPill>
      <FileText aria-hidden />
      From your documents
    </S.DocumentsPill>
  );
};
