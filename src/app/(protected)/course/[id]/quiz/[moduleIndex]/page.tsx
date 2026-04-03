import { Suspense } from 'react';
import ModuleQuizScreen from '@/screens/ModuleQuizScreen';

export default function Page() {
  return (
    <Suspense>
      <ModuleQuizScreen />
    </Suspense>
  );
}
