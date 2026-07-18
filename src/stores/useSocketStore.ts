import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  tasks: Record<string, { progress: number; message: string; result?: any }>;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,
  tasks: {},
  connect: () => {
    if (get().socket) return;
    
    // In preview, we connect to the same host
    const newSocket = io('/');
    
    newSocket.on('connect', () => set({ connected: true }));
    newSocket.on('disconnect', () => set({ connected: false }));
    
    newSocket.on('task_progress', (data: { jobId: string; progress: number; message: string }) => {
      set((state) => ({
        tasks: {
          ...state.tasks,
          [data.jobId]: { progress: data.progress, message: data.message }
        }
      }));
    });

    newSocket.on('task_complete', (data: { jobId: string; result: any }) => {
      set((state) => ({
        tasks: {
          ...state.tasks,
          [data.jobId]: { progress: 100, message: 'Complete', result: data.result }
        }
      }));
    });

    set({ socket: newSocket });
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false });
    }
  }
}));
