import { Suspense } from 'react';
import GenerateCourseScreen from '@/screens/GenerateCourseScreen';

export default function Page() {
  return (
    <Suspense>
      <GenerateCourseScreen />
    </Suspense>
  );
}
