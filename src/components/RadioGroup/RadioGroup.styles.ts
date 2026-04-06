import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

export const Option = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.125rem 1.25rem;
  border: ${(p) => (p.$selected ? `2px solid ${p.theme.colors.accent}` : `1px solid ${p.theme.colors.surfaceBorder}`)};
  border-radius: 8px;
  background: ${(p) => (p.$selected ? p.theme.colorsLib.primary + '06' : p.theme.colors.surface)};
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    box-shadow 0.15s;

  margin: ${(p) => (p.$selected ? '0' : '1px')};

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
    background: ${(p) => (p.$selected ? p.theme.colorsLib.primary + '06' : p.theme.colorsLib.gray100)};
  }
`;

export const HiddenRadio = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Indicator = styled.span<{ $selected: boolean }>`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid ${(p) => (p.$selected ? p.theme.colors.accent : p.theme.colors.border)};
  margin-top: 2px;
  position: relative;
  transition: border-color 0.15s;

  &::after {
    content: '';
    display: ${(p) => (p.$selected ? 'block' : 'none')};
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.accent};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const OptionLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
`;

export const OptionDescription = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const OtherInput = styled.input`
  margin-top: 0.5rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  width: 100%;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
  }

  &::placeholder {
    opacity: 0.4;
  }
`;
