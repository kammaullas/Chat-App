import React, { useState, useRef, useEffect } from 'react';
import { Smile, Send, AtSign } from 'lucide-react';
import MentionDropdown from './MentionDropdown';
import EmojiPickerModal from './EmojiPickerModal';
import { USER_LIST } from '../utils/users';

export default function ChatInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionState, setMentionState] = useState({
    isOpen: false,
    query: '',
    matchIndex: -1,
    selectedIndex: 0
  });

  const textareaRef = useRef(null);

  // Auto-resize textarea to content lines (up to 4-5 lines, max 120px)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // Check for @mention trigger on text changes or caret movement
  const checkMentionTrigger = (value, caretPos) => {
    const textBeforeCaret = value.slice(0, caretPos);
    const match = textBeforeCaret.match(/(^|\s)@([A-Za-z0-9_-]*)$/);

    if (match) {
      const atSymbolIndex = match.index + match[1].length;
      const query = match[2];
      const filtered = USER_LIST.filter((u) =>
        u.toLowerCase().includes(query.toLowerCase())
      );

      setMentionState({
        isOpen: true,
        query,
        matchIndex: atSymbolIndex,
        selectedIndex: 0
      });
    } else {
      if (mentionState.isOpen) {
        setMentionState((prev) => ({ ...prev, isOpen: false }));
      }
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    const caret = e.target.selectionStart;
    setText(val);
    checkMentionTrigger(val, caret);
  };

  const handleSelectMention = (user) => {
    if (!textareaRef.current) return;
    const caret = textareaRef.current.selectionStart;
    const atIndex = mentionState.matchIndex;

    const before = text.slice(0, atIndex);
    const after = text.slice(caret);
    const mentionText = `@${user} `;
    const updated = before + mentionText + after;

    setText(updated);
    setMentionState({ isOpen: false, query: '', matchIndex: -1, selectedIndex: 0 });

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const nextCaret = before.length + mentionText.length;
        textareaRef.current.setSelectionRange(nextCaret, nextCaret);
      }
    });
  };

  const handleSelectEmoji = (emoji) => {
    if (!textareaRef.current) return;
    const caret = textareaRef.current.selectionStart ?? text.length;
    const before = text.slice(0, caret);
    const after = text.slice(caret);
    const updated = before + emoji + after;

    setText(updated);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const nextCaret = caret + emoji.length;
        textareaRef.current.setSelectionRange(nextCaret, nextCaret);
      }
    });
  };

  const handleKeyDown = (e) => {
    if (mentionState.isOpen) {
      const filtered = USER_LIST.filter((u) =>
        u.toLowerCase().includes(mentionState.query.toLowerCase())
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionState((prev) => ({
          ...prev,
          selectedIndex: filtered.length ? (prev.selectedIndex + 1) % filtered.length : 0
        }));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionState((prev) => ({
          ...prev,
          selectedIndex:
            filtered.length ? (prev.selectedIndex - 1 + filtered.length) % filtered.length : 0
        }));
        return;
      }

      if (e.key === 'Enter' || e.key === 'Tab') {
        if (filtered.length > 0) {
          e.preventDefault();
          handleSelectMention(filtered[mentionState.selectedIndex]);
          return;
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionState((prev) => ({ ...prev, isOpen: false }));
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setText('');
    setMentionState({ isOpen: false, query: '', matchIndex: -1, selectedIndex: 0 });

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const canSend = Boolean(text.trim() && !disabled);

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 shrink-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 relative">
        {mentionState.isOpen && (
          <MentionDropdown
            query={mentionState.query}
            selectedIndex={mentionState.selectedIndex}
            onSelect={handleSelectMention}
            onClose={() => setMentionState((prev) => ({ ...prev, isOpen: false }))}
          />
        )}

        {showEmojiPicker && (
          <EmojiPickerModal
            onSelectEmoji={handleSelectEmoji}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}

        {/* Single-row vertically centered input container */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
        >
          {/* @ mention trigger button on the left */}
          <button
            type="button"
            onClick={() => {
              const caret = textareaRef.current?.selectionStart ?? text.length;
              const before = text.slice(0, caret);
              const after = text.slice(caret);
              const updated = `${before}@${after}`;
              setText(updated);
              checkMentionTrigger(updated, caret + 1);
              requestAnimationFrame(() => {
                if (textareaRef.current) {
                  textareaRef.current.focus();
                  textareaRef.current.setSelectionRange(caret + 1, caret + 1);
                }
              });
            }}
            aria-label="Mention a user"
            className="p-1.5 text-slate-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 rounded-xl transition-colors shrink-0"
            title="Mention a user (@)"
          >
            <AtSign className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Emoji trigger button on the left */}
          <button
            type="button"
            data-emoji-trigger="true"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            aria-label="Toggle emoji picker"
            className={`p-1.5 rounded-xl transition-colors shrink-0 ${
              showEmojiPicker
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
            }`}
            title="Insert emoji"
          >
            <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Auto-expanding single-line textarea in center */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            aria-label="Message input box"
            disabled={disabled}
            className="flex-1 max-h-32 py-1 px-2 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none leading-relaxed"
          />

          {/* Send button vertically centered on right */}
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className={`p-2 sm:p-2.5 rounded-xl font-semibold flex items-center justify-center transition-all shrink-0 ${
              canSend
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed shadow-none'
            }`}
            title={canSend ? 'Send chat message (Enter)' : 'Type a message to send'}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Shortened clean footer hint */}
        <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1.5 select-none">
          Enter to send &middot; Shift + Enter for new line
        </div>
      </div>
    </footer>
  );
}
