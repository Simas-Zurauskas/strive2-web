'use client';

import * as S from './TextLoader.styles';

interface TextLoaderProps {
  text?: string;
  showSpinner?: boolean;
}

export const TextLoader = ({ text = 'Loading...', showSpinner = true }: TextLoaderProps) => (
  <S.Container>
    {showSpinner && <S.Spinner />}
    <span>{text}</span>
  </S.Container>
);
