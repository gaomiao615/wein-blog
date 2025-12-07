'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';

interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface CommentsProps {
  comments?: Comment[];
  onSubmit?: (name: string, message: string) => void;
}

export function Comments({ comments = [], onSubmit }: CommentsProps) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && message.trim()) {
      onSubmit?.(name, message);
      setName('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{t('comments.title')}</h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('comments.name')}
          </label>
          <input
            id="comment-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment-message" className="block text-sm font-medium text-gray-700 mb-2">
            {t('comments.message')}
          </label>
          <textarea
            id="comment-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-md min-h-[100px]"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {t('comments.submit')}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t('comments.empty')}</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{comment.name}</h3>
                <span className="text-sm text-gray-500">{comment.createdAt}</span>
              </div>
              <p className="text-gray-700">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

