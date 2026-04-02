'use client';

import { useState } from 'react';
import * as S from './CheckboxGroup.styles';

const OTHER_PREFIX = 'Other: ';

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  allowOther?: boolean;
}

export const CheckboxGroup = ({ name, options, value, onChange, allowOther = false }: CheckboxGroupProps) => {
  const otherEntry = value.find((v) => v.startsWith(OTHER_PREFIX));
  const [isOtherChecked, setIsOtherChecked] = useState(!!otherEntry);
  const [otherText, setOtherText] = useState(otherEntry ? otherEntry.replace(OTHER_PREFIX, '') : '');

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleOtherToggle = () => {
    if (isOtherChecked) {
      setIsOtherChecked(false);
      onChange(value.filter((v) => !v.startsWith(OTHER_PREFIX)));
      setOtherText('');
    } else {
      setIsOtherChecked(true);
      // Don't add to value yet — wait for user to type
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    const withoutOther = value.filter((v) => !v.startsWith(OTHER_PREFIX));
    if (text.trim()) {
      onChange([...withoutOther, `${OTHER_PREFIX}${text}`]);
    } else {
      onChange(withoutOther);
    }
  };

  return (
    <S.Wrapper role="group">
      {options.map((option) => {
        const selected = value.includes(option.value);

        return (
          <S.Option key={option.value} $selected={selected}>
            <S.HiddenCheckbox
              type="checkbox"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => handleToggle(option.value)}
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
        <S.Option $selected={isOtherChecked}>
          <S.HiddenCheckbox
            type="checkbox"
            name={name}
            value="__other__"
            checked={isOtherChecked}
            onChange={handleOtherToggle}
          />
          <S.Indicator $selected={isOtherChecked} />
          <S.Content>
            <S.OptionLabel>Other</S.OptionLabel>
            {isOtherChecked && (
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
