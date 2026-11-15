const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Chat history starts empty as per assignment specification
let messages = [];
let onlineCount = 0;

io.on('connection', (socket) => {
  onlineCount += 1;
  io.emit('presence', { onlineCount });

  // Send current message history to the newly connected client
  socket.emit('history', messages);

  // Handle incoming new message
  socket.on('send_message', (messageData) => {
    if (!messageData || !messageData.text || !messageData.text.trim()) {
      return;
    }

    const newMessage = {
      id: messageData.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user: messageData.user || 'Anonymous',
      text: messageData.text.trim(),
      ts: messageData.ts || Date.now(),
      likes: typeof messageData.likes === 'number' ? messageData.likes : 0
    };

    // Prevent duplicates in history
    if (!messages.some((m) => m.id === newMessage.id)) {
      messages.push(newMessage);
      // Keep up to 200 messages in memory
      if (messages.length > 200) {
        messages = messages.slice(-200);
      }
    }

    // Broadcast the new message to all clients
    io.emit('new_message', newMessage);
  });

  // Handle liking a message
  socket.on('like_message', ({ messageId }) => {
    const target = messages.find((m) => m.id === messageId);
    if (target) {
      target.likes += 1;
      io.emit('message_liked', {
        messageId: target.id,
        likes: target.likes
      });
    }
  });

  socket.on('disconnect', () => {
    onlineCount = Math.max(0, onlineCount - 1);
    io.emit('presence', { onlineCount });
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    onlineCount,
    messagesCount: messages.length,
    timestamp: new Date().toISOString()
  });
});

server.listen(PORT, () => {
  console.log(`[Socket.IO Server] Listening on http://localhost:${PORT}`);
});
