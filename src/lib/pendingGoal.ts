/**
 * Carries a learning goal typed on the (pre-auth) landing page into the
 * post-auth course wizard, so the moment of highest intent — "I want to
 * learn X" — survives the signup interruption instead of dying with it.
 *
 * localStorage (not sessionStorage) on purpose: the Google OAuth round trip
 * and the credentials verify-email flow can both land the user back in a
 * different tab/window than the one that stored the goal.
 *
 * The goal is stored client-side only and first reaches the API as the
 * normal wizard step-1 submission after auth. Cap matches the wizard's
 * GOAL_MAX_LENGTH so the prefill can never exceed what the goal form
 * accepts. All storage access is try/caught — private-mode/storage-denied
 * browsers silently degrade to the un-prefilled flow.
 */

const KEY = 'strive.pendingGoal';

/** Must match GOAL_MAX_LENGTH in GoalStep — the form's own cap. */
const MAX_LENGTH = 500;

export const setPendingGoal = (goal: string): void => {
  const trimmed = goal.trim().slice(0, MAX_LENGTH);
  if (!trimmed) return;
  try {
    localStorage.setItem(KEY, trimmed);
  } catch {
    // Storage denied — the wizard simply starts blank, as before.
  }
};

/** Read without clearing — safe for render-time use (AuthModal context line). */
export const peekPendingGoal = (): string | null => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored && stored.trim() ? stored.trim().slice(0, MAX_LENGTH) : null;
  } catch {
    return null;
  }
};

export const clearPendingGoal = (): void => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to do — a stale value only ever prefills an editable field.
  }
};
