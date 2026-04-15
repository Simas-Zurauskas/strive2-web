import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-top: 8vh;

  ${(p) => p.theme.media.tablet} {
    padding-top: 2rem;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 4.5rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  letter-spacing: -0.03em;
  line-height: 1.05;

  ${(p) => p.theme.media.tabletLarge} {
    font-size: 3rem;
  }

  ${(p) => p.theme.media.mobile} {
    font-size: 2.25rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.6;
  max-width: 540px;
`;

export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1.5rem 0;
  border: none;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  background: transparent;
  color: ${(p) => p.theme.colors.foreground};
  font-family: var(--font-heading-serif), Georgia, serif;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 400;
  outline: none;
  resize: none;
  line-height: 1.6;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
    opacity: 0.4;
    font-style: italic;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ErrorText = styled.p`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.error};
  line-height: 1.4;
`;

export const HelperText = styled.p`
  font-size: 0.9375rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
`;

export const SubmitRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  ${(p) => p.theme.media.mobile} {
    flex-direction: column;
    align-items: stretch;
  }
`;
