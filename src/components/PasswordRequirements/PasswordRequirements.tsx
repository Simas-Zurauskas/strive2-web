'use client';

import { Check } from 'lucide-react';
import { PASSWORD_RULES } from '@/validation';
import * as S from './PasswordRequirements.styles';

interface PasswordRequirementsProps {
  /** Live password value — drives the per-rule pass/fail state. */
  value: string;
}

/**
 * Live checklist that evaluates each rule from `PASSWORD_RULES` against
 * the current input. The rules are imported (not re-declared) so the UI
 * can never drift from yup. Mounted unconditionally below the password
 * field — showing the rules up front is friendlier than waiting for
 * validation to slap a single red message after submit.
 *
 * Visually subdued by default; each row brightens + gets a checkmark
 * pip as it's satisfied.
 */
export const PasswordRequirements = ({ value }: PasswordRequirementsProps) => (
  <S.Wrap aria-label="Password requirements">
    {PASSWORD_RULES.map((rule) => {
      const satisfied = rule.test(value);
      return (
        <S.Row key={rule.id} $satisfied={satisfied} aria-checked={satisfied} role="checkbox">
          <S.Mark $satisfied={satisfied} aria-hidden>
            {satisfied && <Check />}
          </S.Mark>
          {rule.label}
        </S.Row>
      );
    })}
  </S.Wrap>
);
