// context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, restId }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

  const connectSocket = useCallback(() => {
    if (!restId) return null;

    console.log('🔄 Connecting socket for restaurant:', restId);

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      query: {
        restaurantId: restId
      }
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      setIsConnected(true);
      setReconnectAttempts(0);
      
      // Join restaurant room
      newSocket.emit('join-room', `restaurant_${restId}`);
      console.log(`📡 Joined room: restaurant_${restId}`);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Reconnect manually if server disconnected
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
      setIsConnected(false);
      setReconnectAttempts(prev => prev + 1);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      
      // Re-join room after reconnection
      newSocket.emit('join-room', `restaurant_${restId}`);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}`);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('🔴 Reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('🔴 Reconnection failed');
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('🔴 Socket error:', error);
    });

    return newSocket;
  }, [restId]);

  useEffect(() => {
    const newSocket = connectSocket();
    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket) {
        console.log('🧹 Cleaning up socket connection');
        newSocket.removeAllListeners();
        newSocket.disconnect();
      }
    };
  }, [connectSocket]);

  // Reconnect if restId changes
  useEffect(() => {
    if (socket && restId) {
      socket.emit('join-room', `restaurant_${restId}`);
    }
  }, [socket, restId]);

  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected, cannot emit:', event);
    }
  }, [socket, isConnected]);

  const on = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
      return () => socket.off(event, callback);
    }
    return () => {};
  }, [socket]);

  const off = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    reconnectAttempts,
    emit,
    on,
    off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;