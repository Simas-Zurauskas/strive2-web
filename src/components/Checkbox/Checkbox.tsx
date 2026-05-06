'use client';

import { InputHTMLAttributes, ReactNode } from 'react';
import * as S from './Checkbox.styles';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  // ReactNode (not string) so callers can embed inline links — e.g. the
  // signup terms-acceptance checkbox: "I agree to <Link>Terms</Link>...".
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({ label, description, checked, onChange, ...rest }: CheckboxProps) => (
  <S.Label>
    <S.HiddenInput type="checkbox" checked={checked} onChange={onChange} {...rest} />
    <S.Indicator $checked={checked} />
    <S.Content>
      <S.Text>{label}</S.Text>
      {description && <S.Description>{description}</S.Description>}
    </S.Content>
  </S.Label>
);
