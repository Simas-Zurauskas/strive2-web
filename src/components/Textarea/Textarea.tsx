'use client';

import * as S from './Textarea.styles';

interface TextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

export const Textarea = ({ label, name, placeholder, value, rows = 4, onChange, onBlur, error }: TextareaProps) => {
  return (
    <S.Wrapper>
      {label && <S.Label htmlFor={name}>{label}</S.Label>}
      <S.Field
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <S.Error>{error}</S.Error>}
    </S.Wrapper>
  );
};
