import React, { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';
import { ArrowDown, MessageSquare } from 'lucide-react';

export default function MessageList({ messages, onLike }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);
  const previousMessagesCountRef = useRef(messages.length);

  // Monitor scroll position to know if user is near the bottom
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const near = distanceFromBottom < 120;
    setIsNearBottom(near);
    if (near) {
      setShowScrollPrompt(false);
    }
  };

  // Scroll to bottom smoothly
  const scrollToBottom = (behavior = 'smooth') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior });
    }
    setShowScrollPrompt(false);
  };

  // Handle new incoming messages
  useEffect(() => {
    if (messages.length > previousMessagesCountRef.current) {
      if (isNearBottom) {
        scrollToBottom('smooth');
      } else {
        setShowScrollPrompt(true);
      }
    }
    previousMessagesCountRef.current = messages.length;
  }, [messages, isNearBottom]);

  // Initial scroll to bottom on mount
  useEffect(() => {
    scrollToBottom('auto');
  }, []);

  return (
    <div className="relative flex-1 min-h-0 w-full bg-slate-100/75 dark:bg-slate-900 flex flex-col transition-colors duration-200 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        aria-live="polite"
        role="log"
        aria-label="Chat messages thread"
        className="flex-1 overflow-y-auto focus:outline-none"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-3 py-24 px-4 text-center select-none">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  Welcome to #team-engineering 👋
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  This is the start of the team chat. Send a message, mention team members with @, or use emojis!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} onLike={onLike} />
            ))
          )}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* Floating prompt when new messages arrive while user has scrolled up */}
      {showScrollPrompt && (
        <button
          type="button"
          onClick={() => scrollToBottom('smooth')}
          aria-label="Scroll to new messages"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all animate-bounce z-20"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>New messages below</span>
        </button>
      )}
    </div>
  );
}
