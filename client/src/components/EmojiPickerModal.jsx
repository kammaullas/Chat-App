import React, { useEffect, useRef } from 'react';
import { EMOJI_CATEGORIES } from '../utils/emojis';
import { Smile, X } from 'lucide-react';

export default function EmojiPickerModal({ onSelectEmoji, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !e.target.closest('[data-emoji-trigger]')
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-label="Emoji Picker"
      className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95"
    >
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Emojis</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close emoji picker"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 max-h-64 overflow-y-auto space-y-3">
        {EMOJI_CATEGORIES.map((category) => (
          <div key={category.name}>
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5 px-1">
              {category.name}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {category.emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSelectEmoji(emoji)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:scale-125 active:scale-95 transition-all"
                  aria-label={`Select ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
