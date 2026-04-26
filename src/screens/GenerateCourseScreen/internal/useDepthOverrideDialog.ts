'use client';

import { useCallback, useState } from 'react';
import type { DepthOverridePayload } from '@/components/DepthOverrideDialog';

interface UseDepthOverrideDialog {
  open: boolean;
  payload: DepthOverridePayload | null;
  showDialog: (payload: DepthOverridePayload, onConfirm: () => void) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Holds the state for the depth-override confirmation dialog.
 *
 * Separated from the main wizard state because the dialog has its own
 * lifetime — it's opened by the mutation's onError when the backend
 * returns 409 DEPTH_OVERRIDE_REQUIRES_ACK, and closed either by the user
 * confirming (triggering a retry with depthOverrideAcknowledged: true) or
 * cancelling (reverting the depth selector UI).
 *
 * The confirm callback is stored on-open so the caller can pass a closure
 * that captures the exact depth + courseId it was trying to commit; this
 * avoids the hook needing to know the mutation.
 */
export const useDepthOverrideDialog = (): UseDepthOverrideDialog => {
  const [state, setState] = useState<{
    payload: DepthOverridePayload;
    confirm: () => void;
  } | null>(null);

  const showDialog = useCallback(
    (payload: DepthOverridePayload, onConfirm: () => void) => {
      setState({ payload, confirm: onConfirm });
    },
    [],
  );

  const onConfirm = useCallback(() => {
    const action = state?.confirm;
    setState(null);
    action?.();
  }, [state]);

  const onCancel = useCallback(() => {
    setState(null);
  }, []);

  return {
    open: state !== null,
    payload: state?.payload ?? null,
    showDialog,
    onConfirm,
    onCancel,
  };
};
