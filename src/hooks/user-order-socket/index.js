// hooks/useOrderSocket.js
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const useOrderSocket = (orderId, restId, tableId, onOrderUpdate) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { orderId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      
      if (restId) {
        socketRef.current.emit('join-room', `restaurant_${restId}`);
      }
      
      if (tableId) {
        socketRef.current.emit('join-room', `table_${tableId}`);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('order:updated', (data) => {
      if (data.orderId === orderId && onOrderUpdate) {
        onOrderUpdate(data);
      }
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [orderId, restId, tableId, onOrderUpdate]);

  return { isConnected };
};

export default useOrderSocket;