'use client';

import { useI18n } from '@/lib/i18n/context';

interface ToastProps {
  message: 'saved' | 'error' | 'addedToCollection' | 'removedFromCollection';
  onClose?: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  const { t } = useI18n();

  const isError = message === 'error';
  const messageKey = `messages.${message}`;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        isError ? 'bg-red-500' : 'bg-green-500'
      } text-white max-w-sm z-50`}
    >
      <div className="flex justify-between items-center">
        <p>{t(messageKey)}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-200"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

