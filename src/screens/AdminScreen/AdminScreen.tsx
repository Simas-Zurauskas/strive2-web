'use client';

import { useState } from 'react';
import { TopTabs, TopTab } from '@/components';
import { ROUTES } from '@/constants/routes';
import * as S from './AdminScreen.styles';
import { OgImagesTab } from './internal/OgImagesTab';
import { PromotionalEmailsTab } from './internal/PromotionalEmailsTab';
import { RelaunchTab } from './internal/RelaunchTab';

// Tab list lives at top level so it stays a stable type. New tabs land
// here as a single addition + a render-arm in `renderActive`.
const TABS = [
  { key: 'relaunch', label: 'Old-user relaunch' },
  { key: 'promotional-emails', label: 'Promotional emails' },
  { key: 'og-images', label: 'OG images' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

const renderActive = (key: TabKey) => {
  switch (key) {
    case 'relaunch':
      return <RelaunchTab />;
    case 'promotional-emails':
      return <PromotionalEmailsTab />;
    case 'og-images':
      return <OgImagesTab />;
  }
};

const AdminScreen: React.FC = () => {
  const [active, setActive] = useState<TabKey>('relaunch');

  return (
    <S.Layout>
      <S.Container>
        <S.Header>
          <div>
            <S.Eyebrow>Operator console</S.Eyebrow>
            <S.Title>Strive admin</S.Title>
          </div>
          <S.ExitLink href={ROUTES.home()}>Back to app →</S.ExitLink>
        </S.Header>

        <TopTabs>
          {TABS.map((t) => (
            <TopTab key={t.key} $active={active === t.key} onClick={() => setActive(t.key)}>
              {t.label}
            </TopTab>
          ))}
        </TopTabs>

        {renderActive(active)}
      </S.Container>
    </S.Layout>
  );
};

export default AdminScreen;
