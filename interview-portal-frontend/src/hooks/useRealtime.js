import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket } from '../api/realtime';

/**
 * useRealtime Hook - Connects to Socket.IO and provides event subscriptions
 * @returns {Object} Socket instance and utility functions
 */
export const useRealtime = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to socket on mount
    socketRef.current = connectSocket();

    // Cleanup on unmount
    return () => {
      // Don't disconnect, keep connection alive for other components
      // disconnectSocket();
    };
  }, []);

  const subscribe = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      return () => socketRef.current.off(event, callback);
    }
    return () => {};
  };

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    subscribe,
    emit,
    connected: socketRef.current?.connected || false
  };
};

export default useRealtime;
