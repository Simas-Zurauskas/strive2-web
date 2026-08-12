'use client';

import Link from 'next/link';
import * as S from './AboutScreen.styles';

const SUPPORT_EMAIL = 'admin@strive-learning.com';

export const AboutScreen: React.FC = () => {
  return (
    <S.Layout>
      <S.Header>
        <S.Title>About Strive</S.Title>
        <S.Subtitle>
          Tell it what you want to learn — or upload your own material — and Strive builds a complete
          course: structured modules, interactive lessons, quizzes, and spaced review that makes it stick.
        </S.Subtitle>
      </S.Header>

      <S.Grid>
        <S.Card>
          <S.CardChip>Product</S.CardChip>
          <S.CardTitle>Learning that holds</S.CardTitle>
          <S.CardBody>
            An AI mentor sits inside every lesson, quizzes check what you actually absorbed, and a
            spaced-review queue brings things back right before you would forget them.
          </S.CardBody>
          <S.CardLink as={Link} href="/learn">
            Browse topics
          </S.CardLink>
        </S.Card>

        <S.Card>
          <S.CardChip>Company</S.CardChip>
          <S.CardTitle>Who operates it</S.CardTitle>
          <S.CardBody>
            Strive is operated by MB Kūrybinis kodas, a company registered in Lithuania — the data
            controller for your account and everything you create here.
          </S.CardBody>
          <S.CardLink as={Link} href="/privacy">
            Privacy Policy
          </S.CardLink>
        </S.Card>

        <S.Card>
          <S.CardChip>Builder</S.CardChip>
          <S.CardTitle>Who builds it</S.CardTitle>
          <S.CardBody>
            Strive is designed and built by Simas Žurauskas, an AI engineer who built it for his own
            learning first — and still uses it every week.
          </S.CardBody>
          <S.CardLink href="https://www.simaszurauskas.com" rel="author noopener" target="_blank">
            simaszurauskas.com
          </S.CardLink>
        </S.Card>
      </S.Grid>

      <S.SupportLine>
        Questions? Write to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </S.SupportLine>
    </S.Layout>
  );
};
