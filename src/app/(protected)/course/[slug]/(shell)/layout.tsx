'use client';

import { CourseShell } from '@/screens/CourseShell';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return <CourseShell>{children}</CourseShell>;
}
