'use client';

import {
  Infinity as InfinityIcon,
  Layers,
  Lock,
  type LucideIcon,
  Network,
  Repeat,
  Target,
  Wand2,
} from 'lucide-react';
import { useMotion } from '@/theme/motionPresets';
import * as S from './ComparisonTable.styles';
import {
  COMPARISON,
  type ComparisonCell,
  type ComparisonRowIcon,
} from '../../constants';

const ICONS: Record<ComparisonRowIcon, LucideIcon> = {
  Target,
  Layers,
  Wand2,
  Repeat,
  Network,
  Lock,
  Infinity: InfinityIcon,
};

const CELL_LABELS: Record<ComparisonCell, string> = {
  yes: 'Yes',
  no: 'No',
  partial: 'Partial',
  manual: 'Manual',
  depends: 'Depends',
  varies: 'Varies',
};

const renderCell = (kind: ComparisonCell, isStrive: boolean) => {
  if (kind === 'yes') {
    return (
      <S.YesPill $strive={isStrive}>
        <S.PillCheck aria-hidden="true">✓</S.PillCheck>
        <span>Yes</span>
      </S.YesPill>
    );
  }
  if (kind === 'no') {
    return (
      <S.NoMark>
        <span aria-hidden="true">—</span>
        <S.SrOnly>No</S.SrOnly>
      </S.NoMark>
    );
  }
  return <S.SoftPill>{CELL_LABELS[kind]}</S.SoftPill>;
};

export const ComparisonTable = () => {
  const { fadeUp } = useMotion();

  return (
    <S.Wrap>
      <S.Inner
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={{ ...fadeUp.transition, duration: 0.4 }}
      >
        <S.SectionHeader>
          <S.Eyebrow>How Strive compares</S.Eyebrow>
          <S.Heading>Where Strive fits among the alternatives.</S.Heading>
        </S.SectionHeader>

        <S.TableWrap>
          <S.Table>
            <thead>
              <tr>
                <th scope="col">&nbsp;</th>
                {COMPARISON.cols.map((col, i) => (
                  <th key={col} scope="col" className={i === 0 ? 'strive' : undefined}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((row) => {
                const Icon = ICONS[row.icon];
                return (
                  <tr key={row.label}>
                    <td>
                      <S.RowLabel>
                        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                        <span>{row.label}</span>
                      </S.RowLabel>
                    </td>
                    {row.cells.map((cell, i) => (
                      <td key={i} className={i === 0 ? 'strive' : undefined}>
                        {renderCell(cell, i === 0)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </S.Table>
        </S.TableWrap>

        <S.CardList>
          {COMPARISON.cols.map((col, colIdx) => (
            <S.Card key={col} $strive={colIdx === 0}>
              <S.CardHeader>{col}</S.CardHeader>
              {COMPARISON.rows.map((row) => {
                const Icon = ICONS[row.icon];
                return (
                  <S.CardRow key={row.label}>
                    <S.CardLabel>
                      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
                      <span>{row.label}</span>
                    </S.CardLabel>
                    <S.CardValue>{renderCell(row.cells[colIdx], colIdx === 0)}</S.CardValue>
                  </S.CardRow>
                );
              })}
            </S.Card>
          ))}
        </S.CardList>
      </S.Inner>
    </S.Wrap>
  );
};
