import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export const connectSocket = () => {
  if (socket) return socket;
  
  console.log('Connecting to Socket.IO server...');
  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Event listeners for real-time updates

export const onResumeUploaded = (callback) => {
  const s = getSocket();
  s.on('resume:uploaded', callback);
  return () => s.off('resume:uploaded', callback);
};

export const onResumeDeleted = (callback) => {
  const s = getSocket();
  s.on('resume:deleted', callback);
  return () => s.off('resume:deleted', callback);
};

export const onAIInterviewStarted = (callback) => {
  const s = getSocket();
  s.on('ai-interview:started', callback);
  return () => s.off('ai-interview:started', callback);
};

export const onAIInterviewResponse = (callback) => {
  const s = getSocket();
  s.on('ai-interview:response', callback);
  return () => s.off('ai-interview:response', callback);
};

export const onAIInterviewCompleted = (callback) => {
  const s = getSocket();
  s.on('ai-interview:completed', callback);
  return () => s.off('ai-interview:completed', callback);
};

export const onSubmissionCreated = (callback) => {
  const s = getSocket();
  s.on('submission:created', callback);
  return () => s.off('submission:created', callback);
};

export default {
  connectSocket,
  getSocket,
  disconnectSocket,
  onResumeUploaded,
  onResumeDeleted,
  onAIInterviewStarted,
  onAIInterviewResponse,
  onAIInterviewCompleted,
  onSubmissionCreated
};
