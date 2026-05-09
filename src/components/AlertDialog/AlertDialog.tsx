'use client';

import { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/Button';
import { useDialog } from '@/hooks';
import * as S from './AlertDialog.styles';

interface AlertDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * Visual tone of the confirm action.
   *   - 'default'  → primary (positive affirmation, e.g. "save")
   *   - 'danger'   → red filled (destructive, e.g. "cancel subscription")
   *   - 'neutral'  → secondary outlined (intentional but not destructive,
   *                   e.g. "downgrade to a lower plan")
   */
  variant?: 'default' | 'danger' | 'neutral';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AlertDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: AlertDialogProps) => {
  // Disable close while a destructive action is in flight — the user
  // shouldn't be able to dismiss the confirmation mid-mutation.
  const handleEscape = useCallback(() => {
    if (!loading) onCancel();
  }, [loading, onCancel]);

  const dialogRef = useDialog<HTMLDivElement>({ open, onClose: handleEscape });

  if (!open) return null;

  return createPortal(
    <>
      <S.Backdrop onClick={loading ? undefined : onCancel} />
      <S.Dialog
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-desc"
      >
        <S.Body>
          <S.Title id="alert-title">{title}</S.Title>
          <S.Description id="alert-desc">{description}</S.Description>
        </S.Body>
        <S.Actions>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={
              variant === 'danger' ? 'danger'
                : variant === 'neutral' ? 'secondary'
                : 'primary'
            }
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </S.Actions>
      </S.Dialog>
    </>,
    document.body,
  );
};
