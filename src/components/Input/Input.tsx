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
  required?: boolean;
  'aria-label'?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
  required,
  'aria-label': ariaLabel,
  onChange,
  onBlur,
  onFocus,
  error,
}: InputProps) => {
  const errorId = error ? `${name}-error` : undefined;
  // Inputs without a visible <label> get an explicit aria-label
  // (caller-provided, falling back to placeholder) so AT users always hear a
  // field name. Placeholder alone is not announced reliably by screen readers
  // and disappears once the user begins typing.
  const fallbackLabel = !label ? ariaLabel ?? placeholder : undefined;
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
        required={required}
        aria-label={fallbackLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {error && (
        <S.Error id={errorId} role="alert">
          {error}
        </S.Error>
      )}
    </S.Wrapper>
  );
};
