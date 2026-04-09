'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = session?.token as string | undefined;
    if (!token) return;

    const s = io(NEXT_PUBLIC_API_URL, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      console.log('[Socket.io] Connected');
    });

    s.on('disconnect', (reason) => {
      console.log('[Socket.io] Disconnected:', reason);
    });

    s.on('connect_error', (err) => {
      console.error('[Socket.io] Connection error:', err.message);
    });

    socketRef.current = s;
    setSocket(s); // eslint-disable-line react-hooks/set-state-in-effect -- setting state after resource creation

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [session?.token]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
