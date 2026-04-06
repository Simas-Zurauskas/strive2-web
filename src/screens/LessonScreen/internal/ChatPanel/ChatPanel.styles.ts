import styled from 'styled-components';

export const Container = styled.div`
  width: 360px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.surface};
  border-left: 1px solid ${(p) => p.theme.colors.border};

  ${(p) => p.theme.media.desktop} {
    position: static;
    height: 100%;
  }

  ${(p) => p.theme.media.tablet} {
    width: 100%;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

export const Title = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.foreground};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${(p) => p.theme.colors.muted};
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: ${(p) => p.theme.colors.background};
    color: ${(p) => p.theme.colors.foreground};
  }
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const PlaceholderMessage = styled.div`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.muted};
  line-height: 1.5;
  padding: 0.75rem;
  border-radius: 8px;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
`;

export const ContextBadge = styled.div`
  font-size: 0.6875rem;
  color: ${(p) => p.theme.colors.muted};
  padding: 0.375rem 0.5rem;
  border-radius: 6px;
  background: ${(p) => p.theme.colors.background};
  border: 1px solid ${(p) => p.theme.colors.border};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const InputArea = styled.div`
  padding: 0.75rem;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.foreground};
  font-size: 0.8125rem;
  font-family: inherit;
  outline: none;

  &::placeholder {
    color: ${(p) => p.theme.colors.muted};
  }

  &:focus {
    border-color: ${(p) => p.theme.colors.accent};
  }
`;
