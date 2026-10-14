import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'bottom' | 'right';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full bg-[var(--color-surface)] border-[var(--color-border)] shadow-2xl transition-transform duration-200 flex flex-col ${
          position === 'bottom'
            ? 'mt-auto rounded-t-2xl border-t max-h-[85vh] animate-in slide-in-from-bottom duration-200'
            : 'ml-auto h-full max-w-md border-l animate-in slide-in-from-right duration-200'
        }`}
      >
        {/* Grab Handle for Bottom Drawer */}
        {position === 'bottom' && (
          <div className="w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mt-3 shrink-0" />
        )}

        {/* Header */}
        <div className="p-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between shrink-0">
          <h3 className="type-h3 text-[var(--color-foreground)] font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="touch-target p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] transition"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
