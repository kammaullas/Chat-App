import React, { useEffect, useRef } from 'react';
import { USER_LIST, getUserPalette, getUserInitials } from '../utils/users';
import { AtSign } from 'lucide-react';

export default function MentionDropdown({ query, selectedIndex, onSelect, onClose }) {
  const listRef = useRef(null);

  const filteredUsers = USER_LIST.filter((user) =>
    user.toLowerCase().includes(query.toLowerCase())
  );

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (filteredUsers.length === 0) {
    return (
      <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <AtSign className="w-4 h-4" />
          <span>No matching users</span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="Mention a user"
      className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95"
    >
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          Members ({filteredUsers.length})
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">↑↓ to navigate, ↵ to select</span>
      </div>

      <div ref={listRef} className="max-h-56 overflow-y-auto p-1 space-y-0.5">
        {filteredUsers.map((user, idx) => {
          const isSelected = idx === selectedIndex;
          const palette = getUserPalette(user);

          return (
            <button
              key={user}
              type="button"
              role="option"
              aria-selected={isSelected}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(user);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg ${palette.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
              >
                {getUserInitials(user)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm tracking-tight truncate">{user}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate">
                  @{user.toLowerCase()}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
