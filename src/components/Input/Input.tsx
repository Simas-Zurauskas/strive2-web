'use client';

import * as S from './Input.styles';

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  min?: number;
  max?: number;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  autoFocus?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  min,
  max,
  maxLength,
  inputMode,
  autoComplete,
  autoFocus,
  onChange,
  onBlur,
  error,
}: InputProps) => {
  return (
    <S.Wrapper>
      {label && <S.Label htmlFor={name}>{label}</S.Label>}
      <S.Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <S.Error>{error}</S.Error>}
    </S.Wrapper>
  );
};
