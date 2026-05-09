'use client';

import { useSession } from 'next-auth/react';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { NEXT_PUBLIC_API_URL } from '@/conf/env';

interface SocketContextValue {
  socket: Socket | null;
  /** True when the client has lost the realtime channel. UI surfaces that
   * depend on push events (job progress, recall queue invalidations,
   * gamification toasts) can use this to show a degraded-mode banner. */
  disconnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, disconnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [disconnected, setDisconnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  // Toast IDs are tracked so the "reconnecting" toast can be dismissed and
  // replaced by the "reconnected" toast in the same slot, avoiding stacking.
  const disconnectToastId = useRef<string | number | null>(null);
  const everConnected = useRef(false);

  useEffect(() => {
    const token = session?.token as string | undefined;
    if (!token) return;

    const s = io(NEXT_PUBLIC_API_URL, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      setDisconnected(false);
      if (disconnectToastId.current !== null && everConnected.current) {
        toast.dismiss(disconnectToastId.current);
        toast.success('Reconnected', { duration: 2_000 });
        disconnectToastId.current = null;
      }
      everConnected.current = true;
    });

    s.on('disconnect', (reason) => {
      // `io client disconnect` fires when we tore down the socket on logout
      // or component unmount — no need to alarm the user.
      if (reason === 'io client disconnect') return;
      setDisconnected(true);
      if (disconnectToastId.current === null) {
        disconnectToastId.current = toast.warning('Reconnecting…', {
          duration: Infinity,
          description: 'Real-time updates will resume automatically.',
        });
      }
    });

    s.on('connect_error', (err) => {
      console.error('[Socket.io] Connection error:', err.message);
    });

    socketRef.current = s;
    setSocket(s); // eslint-disable-line react-hooks/set-state-in-effect -- setting state after resource creation

    return () => {
      s.disconnect();
      if (disconnectToastId.current !== null) {
        toast.dismiss(disconnectToastId.current);
        disconnectToastId.current = null;
      }
      socketRef.current = null;
      setSocket(null);
      setDisconnected(false);
      everConnected.current = false;
    };
  }, [session?.token]);

  // Stable identity across parent renders — without useMemo, every render
  // of SocketProvider's parent would hand consumers a new value object and
  // force them to re-render even when socket+disconnected are unchanged.
  const value = useMemo(() => ({ socket, disconnected }), [socket, disconnected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
