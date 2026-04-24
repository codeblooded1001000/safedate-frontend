'use client';

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';

export function useSocket(sessionCode: string, userType?: 'creator' | 'partner' | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!sessionCode) return;

    const s = getSocket();
    if (!s.connected) {
      s.connect();
    }
    setSocket(s);

    const onConnect = () => {
      setIsConnected(true);
      s.emit('joinSession', { sessionCode, userType: userType?.toUpperCase() });
    };
    const onDisconnect = () => setIsConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    if (s.connected) {
      setIsConnected(true);
      s.emit('joinSession', { sessionCode, userType: userType?.toUpperCase() });
    }

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
    };
  }, [sessionCode, userType]);

  useEffect(() => {
    if (!socket || !userType) return;
    const role = userType.toUpperCase() as 'CREATOR' | 'PARTNER';
    const intervalMs = 3 * 60 * 1000;
    const id = setInterval(() => {
      socket.emit('activityPing', { sessionCode, userType: role });
    }, intervalMs);
    return () => clearInterval(id);
  }, [socket, userType, sessionCode]);

  return { socket, isConnected };
}
