import React from 'react';
import { Dialog } from './Dialog.tsx';
import { Button } from './Button.tsx';
import { useI18n } from '../../context/I18nContext.tsx';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = false,
  isLoading = false,
}) => {
  const { t } = useI18n();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="type-body text-[var(--color-muted)]">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel || t('actionCancel')}
          </Button>

          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel || t('actionConfirm')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
