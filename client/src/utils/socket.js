import { io } from 'socket.io-client';

const rawUrl = import.meta.env.VITE_SOCKET_URL;
const SOCKET_URL = (typeof rawUrl === 'string' && rawUrl.trim())
  ? rawUrl.trim().replace(/\/+$/, '')
  : 'http://localhost:3001';

let socket = null;

export function getSocket() {
  if (!socket) {
    if (typeof window !== 'undefined') {
      console.log('[Socket] Connecting to backend at:', SOCKET_URL);
    }
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
