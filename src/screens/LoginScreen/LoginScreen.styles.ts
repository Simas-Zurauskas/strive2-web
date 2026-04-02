import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 360px;

  .form {
    &__title {
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
      color: ${(p) => p.theme.colors.foreground};
    }

    &__input {
      padding: 0.75rem 1rem;
      border: 1px solid ${(p) => p.theme.colors.border};
      border-radius: 8px;
      background: ${(p) => p.theme.colors.background};
      color: ${(p) => p.theme.colors.foreground};
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.15s;

      &:focus {
        border-color: ${(p) => p.theme.colors.accent};
      }

      &::placeholder {
        opacity: 0.4;
      }
    }

    &__field-error {
      font-size: 0.75rem;
      color: ${(p) => p.theme.colors.error};
      margin-top: -0.5rem;
    }

    &__error {
      font-size: 0.8125rem;
      color: ${(p) => p.theme.colors.error};
      text-align: center;
    }

    &__footer {
      font-size: 0.8125rem;
      text-align: center;
      opacity: 0.6;

      a {
        color: ${(p) => p.theme.colors.accent};
        text-decoration: none;
      }
    }
  }
`;

export const SubmitBtn = styled.button<{ $loading?: boolean }>`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.accent};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: ${(p) => (p.$loading ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$loading ? 0.6 : 1)};
  transition: opacity 0.15s;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  opacity: 0.4;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(p) => p.theme.colors.border};
  }
`;

export const GoogleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;
