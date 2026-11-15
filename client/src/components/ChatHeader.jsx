import React from 'react';
import { Radio, WifiOff, Sun, Moon } from 'lucide-react';
import { USER_LIST, getUserPalette, getUserInitials } from '../utils/users';

export default function ChatHeader({
  isConnected,
  isOfflineMode,
  onlineCount,
  theme,
  onToggleTheme
}) {
  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 select-none transition-colors duration-200 z-10 shrink-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            #
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg tracking-tight leading-tight">
              team-engineering
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Team Chat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Compact overlapping avatar stack showing the 5 channel users */}
          <div
            className="flex items-center -space-x-1.5 overflow-hidden py-0.5"
            aria-label="Available channel authors"
          >
            {USER_LIST.map((user) => {
              const palette = getUserPalette(user);
              return (
                <div
                  key={user}
                  title={`${user} (Random author)`}
                  className={`w-6 h-6 rounded-full ${palette.avatarBg} text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-2xs cursor-default leading-none transition-transform hover:scale-110 hover:z-10`}
                >
                  {getUserInitials(user)}
                </div>
              );
            })}
          </div>

          {/* Connection status badge */}
          {isConnected ? (
            <div
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              title="Connected to real-time Socket.IO server"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{onlineCount} online</span>
            </div>
          ) : isOfflineMode ? (
            <div
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              title="Operating in local offline mode"
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Offline Mode</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              title="Connecting to server..."
            >
              <Radio className="w-3.5 h-3.5 animate-spin text-slate-500 dark:text-slate-400" />
              <span>Connecting...</span>
            </div>
          )}

          {/* Theme toggle button displaying target mode */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-medium hidden sm:inline">Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
