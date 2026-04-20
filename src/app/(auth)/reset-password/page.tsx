import { Suspense } from 'react';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordScreen />
    </Suspense>
  );
}
