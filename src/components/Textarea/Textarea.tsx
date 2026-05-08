'use client';

import * as S from './Textarea.styles';

interface TextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  rows?: number;
  required?: boolean;
  'aria-label'?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

export const Textarea = ({
  label,
  name,
  placeholder,
  value,
  rows = 4,
  required,
  'aria-label': ariaLabel,
  onChange,
  onBlur,
  error,
}: TextareaProps) => {
  const errorId = error ? `${name}-error` : undefined;
  const fallbackLabel = !label ? ariaLabel ?? placeholder : undefined;
  return (
    <S.Wrapper>
      {label && <S.Label htmlFor={name}>{label}</S.Label>}
      <S.Field
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        rows={rows}
        required={required}
        aria-label={fallbackLabel}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && (
        <S.Error id={errorId} role="alert">
          {error}
        </S.Error>
      )}
    </S.Wrapper>
  );
};
