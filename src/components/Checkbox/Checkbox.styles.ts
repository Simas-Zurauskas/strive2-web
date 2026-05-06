import styled from 'styled-components';

export const Label = styled.label`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.15s;
  color: ${(p) => p.theme.colors.muted};

  &:hover {
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const Indicator = styled.span<{ $checked: boolean }>`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid ${(p) => (p.$checked ? p.theme.colors.accent : p.theme.colors.border)};
  background: ${(p) => (p.$checked ? p.theme.colors.accent : 'transparent')};
  margin-top: 1px;
  position: relative;
  transition:
    background 0.15s,
    border-color 0.15s;

  &::after {
    content: '\\2713';
    display: ${(p) => (p.$checked ? 'block' : 'none')};
    color: #fff;
    font-size: 0.6875rem;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  ${Label}:hover & {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;

export const Content = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const Text = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;

  /* Inline links inside the label (e.g. Terms / Privacy) need to be
     visually distinct from the body text — otherwise the user can't
     tell what's clickable vs what just toggles the checkbox. */
  a {
    color: ${(p) => p.theme.colors.accent};
    text-decoration: underline;
    text-underline-offset: 2px;
    font-weight: 600;

    &:hover {
      text-decoration-thickness: 2px;
    }
  }
`;

export const Description = styled.span`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.4;
  font-weight: 400;
`;
