import React from 'react';
import { getUserPalette, getUserInitials, USER_LIST } from '../utils/users';
import { ThumbsUp } from 'lucide-react';

// Format timestamp to user-friendly time string (e.g., 10:45 AM)
function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Format full timestamp for hover title tooltip
function formatFullDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// Detect if a message contains only emojis and whitespace
function isEmojiOnly(text) {
  if (!text) return false;
  const stripped = text.replace(/\s+/g, '');
  if (!stripped) return false;
  const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Modifier}|\uFE0F|\u200D)+$/u;
  return emojiRegex.test(stripped);
}

// Safely parse text and render @mentions as styled React pill components with high contrast
function renderMessageText(text) {
  if (!text) return null;

  const parts = text.split(/(@[A-Za-z0-9_-]+)/g);

  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      const mentionedName = part.substring(1);
      const isKnownUser = USER_LIST.includes(mentionedName);
      const palette = isKnownUser ? getUserPalette(mentionedName) : null;

      return (
        <span
          key={index}
          className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 text-xs font-semibold rounded-md border transition-colors ${
            palette
              ? palette.mentionBg
              : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300/70 dark:border-blue-800/80'
          }`}
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function MessageItem({ message, onLike }) {
  const { id, user, text, ts, likes = 0 } = message;
  const palette = getUserPalette(user);
  const emojiOnly = isEmojiOnly(text);

  return (
    <article
      tabIndex={0}
      className="group flex items-center justify-between gap-3 px-3 py-2 hover:bg-slate-200/40 dark:hover:bg-white/[0.03] rounded-xl transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-400"
      aria-label={`Message from ${user}: ${text}`}
    >
      {/* Left side: Avatar + Header + Bubble Content */}
      <div className="flex items-start gap-3 flex-1 min-w-0 pr-3 sm:pr-4">
        {/* User Avatar */}
        <div
          className={`w-9 h-9 rounded-xl ${palette.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs select-none leading-none mt-0.5`}
          aria-hidden="true"
        >
          {getUserInitials(user)}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0">
          {/* Author Name and Timestamp (with hover tooltip) above bubble */}
          <div className="flex items-baseline gap-2 mb-1 pl-0.5">
            <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight">
              {user}
            </span>
            <span
              title={formatFullDateTime(ts)}
              className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium cursor-help"
            >
              {formatTime(ts)}
            </span>
          </div>

          {/* Consistent Bubble Surface for all messages, including emoji-only */}
          <div
            className={`inline-block min-w-[3.25rem] max-w-[88%] sm:max-w-[78%] rounded-2xl rounded-tl-sm px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs leading-relaxed break-words [overflow-wrap:anywhere] whitespace-pre-wrap select-text ${
              emojiOnly
                ? 'text-2xl leading-normal'
                : 'text-sm text-slate-800 dark:text-slate-100'
            }`}
          >
            {renderMessageText(text)}
          </div>
        </div>
      </div>

      {/* Right side: Vertically centered Like Button with softened unliked contrast */}
      <div className="shrink-0 flex items-center select-none">
        <button
          type="button"
          onClick={() => onLike(id)}
          aria-label={`Like message from ${user}, currently ${likes} likes`}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
            likes > 0
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 shadow-2xs'
              : 'bg-transparent hover:bg-white dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <ThumbsUp
            className={`w-3.5 h-3.5 ${likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`}
          />
          <span className="tabular-nums font-bold text-xs">{likes}</span>
        </button>
      </div>
    </article>
  );
}
