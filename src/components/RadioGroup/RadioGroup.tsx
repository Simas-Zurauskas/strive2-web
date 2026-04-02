'use client';

import { useState } from 'react';
import * as S from './RadioGroup.styles';

const OTHER_PREFIX = 'Other: ';
const OTHER_VALUE = '__other__';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  allowOther?: boolean;
}

export const RadioGroup = ({ name, options, value, onChange, allowOther = false }: RadioGroupProps) => {
  const isOtherSelected = value.startsWith(OTHER_PREFIX);
  const [otherText, setOtherText] = useState(isOtherSelected ? value.replace(OTHER_PREFIX, '') : '');

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    // Always set a prefixed value so isOtherSelected stays true;
    // the form-level validation should reject empty "Other: " entries
    onChange(`${OTHER_PREFIX}${text}`);
  };

  return (
    <S.Wrapper role="radiogroup">
      {options.map((option) => {
        const selected = !isOtherSelected && value === option.value;

        return (
          <S.Option key={option.value} $selected={selected}>
            <S.HiddenRadio
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => {
                setOtherText('');
                onChange(option.value);
              }}
            />
            <S.Indicator $selected={selected} />
            <S.Content>
              <S.OptionLabel>{option.label}</S.OptionLabel>
              {option.description && <S.OptionDescription>{option.description}</S.OptionDescription>}
            </S.Content>
          </S.Option>
        );
      })}

      {allowOther && (
        <S.Option $selected={isOtherSelected}>
          <S.HiddenRadio
            type="radio"
            name={name}
            value={OTHER_VALUE}
            checked={isOtherSelected}
            onChange={() => onChange(`${OTHER_PREFIX}${otherText}`)}
          />
          <S.Indicator $selected={isOtherSelected} />
          <S.Content>
            <S.OptionLabel>Other</S.OptionLabel>
            {isOtherSelected && (
              <S.OtherInput
                type="text"
                placeholder="Please specify..."
                value={otherText}
                onChange={(e) => handleOtherTextChange(e.target.value)}
                autoFocus
              />
            )}
          </S.Content>
        </S.Option>
      )}
    </S.Wrapper>
  );
};
