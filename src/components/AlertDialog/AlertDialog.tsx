'use client';

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/Button';
import * as S from './AlertDialog.styles';

interface AlertDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
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
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    },
    [loading, onCancel],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <>
      <S.Backdrop onClick={loading ? undefined : onCancel} />
      <S.Dialog role="alertdialog" aria-labelledby="alert-title" aria-describedby="alert-desc">
        <S.Body>
          <S.Title id="alert-title">{title}</S.Title>
          <S.Description id="alert-desc">{description}</S.Description>
        </S.Body>
        <S.Actions>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </S.Actions>
      </S.Dialog>
    </>,
    document.body,
  );
};
