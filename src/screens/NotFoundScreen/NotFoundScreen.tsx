'use client';

import { PageLayout } from '@/components';
import * as S from './NotFoundScreen.styles';

/**
 * Global 404 body. `app/not-found.tsx` supplies the chrome, because the ROOT
 * layout does not — PublicTopBar, <main id="main-content"> and the Footer are
 * all mounted by the route-group layouts, which a root 404 never enters.
 */
export const NotFoundScreen = () => (
  <PageLayout>
    <S.Body>
      <S.Eyebrow>404</S.Eyebrow>
      <S.Title>We couldn&apos;t find that page</S.Title>
      <S.Copy>
        The link may be out of date, or the address may have a typo. Here is the way back.
      </S.Copy>
      <S.Links aria-label="Site sections">
        <S.NavLink href="/">Home</S.NavLink>
        <S.NavLink href="/help">Help center</S.NavLink>
        <S.NavLink href="/learn">Browse topics</S.NavLink>
        <S.NavLink href="/blog">Blog</S.NavLink>
        <S.NavLink href="/pricing">Pricing</S.NavLink>
      </S.Links>
    </S.Body>
  </PageLayout>
);
