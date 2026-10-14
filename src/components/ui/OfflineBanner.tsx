import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';
import { useI18n } from '../../context/I18nContext.tsx';

export interface OfflineBannerProps {
  customMessage?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ customMessage }) => {
  const { t } = useI18n();
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div
        role="status"
        className="w-full bg-[var(--color-success)] text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-xs transition-all"
      >
        <CheckCircle className="w-4 h-4" />
        <span>Connected to network. Synced successfully.</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="w-full bg-[var(--color-warning)] text-white text-xs font-semibold py-2.5 px-4 text-center flex items-center justify-center gap-2 shadow-xs animate-in slide-in-from-top duration-150"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{customMessage || t('offlineNotice')}</span>
    </div>
  );
};
