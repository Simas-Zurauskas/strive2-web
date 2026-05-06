import * as yup from 'yup';

// Moderate password standard. We're a learning app, not a bank — we don't
// need symbol-class rules or 12-char minimums that drive users to "Pa$$w0rd!".
// What we DO want is to block obviously weak inputs: all-letters ("password"),
// all-digits ("12345678"), and anything under 8 characters. The rule below
// shapes out to "8+ characters, mix of letters and numbers" — easy to
// satisfy with anything memorable, hard to satisfy with the worst common
// passwords (most appear on rockyou top-100 as either pure-alpha or pure-digit).
//
// Order matters: yup runs validators in declaration order and stops at the
// first failure, so the user sees one specific message at a time rather than
// a stack of three. The PasswordRequirements component complements this by
// showing the full checklist live as they type.
const passwordField = yup
  .string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
  .matches(/\d/, 'Password must contain at least one number');

export const signInSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const signUpSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: passwordField,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  // GDPR / consumer-rights compliance: explicit opt-in to Terms + Privacy
  // is required before account creation. The checkbox cannot be
  // pre-checked (per consent rules) — initialValue is false in the form.
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Please accept the Terms and Privacy Policy to continue')
    .required('Please accept the Terms and Privacy Policy to continue'),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const passwordWithConfirm = {
  password: passwordField,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
};

export const resetPasswordSchema = yup.object(passwordWithConfirm);
export const setPasswordSchema = yup.object(passwordWithConfirm);
export const changePasswordSchema = yup.object(passwordWithConfirm);

// Step 2 of the email-OTP flow: validates the 6-digit code the user types
// after we've sent it via /auth/security-action/request-code.
export const securityActionCodeSchema = yup.object({
  code: yup
    .string()
    .matches(/^\d{6}$/, 'Enter the 6-digit code from your email')
    .required('Confirmation code is required'),
});

// Shared rule helpers — keep the PasswordRequirements component honest
// against the schema. Adding/removing a rule here flows everywhere.
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { id: 'letter', label: 'Contains a letter', test: (v: string) => /[a-zA-Z]/.test(v) },
  { id: 'number', label: 'Contains a number', test: (v: string) => /\d/.test(v) },
] as const;

export type SignInValues = yup.InferType<typeof signInSchema>;
export type SignUpValues = yup.InferType<typeof signUpSchema>;
export type ForgotPasswordValues = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordValues = yup.InferType<typeof resetPasswordSchema>;
export type SetPasswordValues = yup.InferType<typeof setPasswordSchema>;
export type ChangePasswordValues = yup.InferType<typeof changePasswordSchema>;
export type SecurityActionCodeValues = yup.InferType<typeof securityActionCodeSchema>;
