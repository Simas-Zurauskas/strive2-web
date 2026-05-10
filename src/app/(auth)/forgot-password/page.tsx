import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset your password — Strive',
  description: 'Send yourself a password-reset link for your Strive account.',
  robots: { index: false, follow: false },
};

export { default } from '@/screens/ForgotPasswordScreen';
