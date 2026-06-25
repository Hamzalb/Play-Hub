'use client';

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, getSocket } from '@/lib/socket';

export function useSocket(branchId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!branchId) return;

    connectSocket(branchId);
    socketRef.current = getSocket();

    return () => {
      // Don't disconnect on unmount — socket is shared across the app
    };
  }, [branchId]);

  return socketRef.current;
}

export function useSocketEvent<T>(event: string, handler: (data: T) => void, branchId?: string) {
  const socket = useSocket(branchId);

  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => { socket.off(event, handler); };
  }, [socket, event, handler]);
}
