import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { getRandomUser } from './utils/users';
import { getSocket } from './utils/socket';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);

  // Initialize theme with localStorage persistence and OS preference fallback
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  const socketRef = useRef(null);

  // Synchronize 'dark' class on root html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initialize Socket.io connection and listeners
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    // Trigger offline mode if server doesn't respond within 2.5s
    const offlineTimer = setTimeout(() => {
      if (!socket.connected) {
        setIsOfflineMode(true);
      }
    }, 2500);

    const handleConnect = () => {
      setIsConnected(true);
      setIsOfflineMode(false);
      clearTimeout(offlineTimer);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setIsOfflineMode(true);
    };

    const handleConnectError = () => {
      setIsConnected(false);
      setIsOfflineMode(true);
    };

    const handleHistory = (serverMessages) => {
      if (Array.isArray(serverMessages)) {
        setMessages(serverMessages);
      }
    };

    const handleNewMessage = (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) {
          return prev;
        }
        return [...prev, newMsg];
      });
    };

    const handleMessageLiked = ({ messageId, likes }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, likes } : msg))
      );
    };

    const handlePresence = ({ onlineCount: count }) => {
      if (typeof count === 'number') {
        setOnlineCount(count);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('history', handleHistory);
    socket.on('new_message', handleNewMessage);
    socket.on('message_liked', handleMessageLiked);
    socket.on('presence', handlePresence);

    if (socket.connected) {
      setIsConnected(true);
      setIsOfflineMode(false);
      clearTimeout(offlineTimer);
    }

    return () => {
      clearTimeout(offlineTimer);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('history', handleHistory);
      socket.off('new_message', handleNewMessage);
      socket.off('message_liked', handleMessageLiked);
      socket.off('presence', handlePresence);
    };
  }, []);

  // Send message handler: creates message with random author from ["Alan", "Bob", "Carol", "Dean", "Elin"]
  const handleSendMessage = useCallback((text) => {
    const randomUser = getRandomUser();
    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user: randomUser,
      text,
      ts: Date.now(),
      likes: 0
    };

    // Optimistic local update
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });

    // Broadcast through socket if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', newMsg);
    }
  }, []);

  // Like message handler
  const handleLike = useCallback((messageId) => {
    // Optimistic local update
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );

    // Emit like event to socket server if connected
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('like_message', { messageId });
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-slate-100/75 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden font-sans">
      <ChatHeader
        isConnected={isConnected}
        isOfflineMode={isOfflineMode}
        onlineCount={onlineCount}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
        <MessageList messages={messages} onLike={handleLike} />
        <ChatInput onSendMessage={handleSendMessage} disabled={false} />
      </main>
    </div>
  );
}
