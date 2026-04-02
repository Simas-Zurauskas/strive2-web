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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export const Input = ({ label, name, type = 'text', placeholder, value, min, max, onChange, onBlur, error }: InputProps) => {
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
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <S.Error>{error}</S.Error>}
    </S.Wrapper>
  );
};
