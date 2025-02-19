// src/socket.ts
import { io, Socket } from 'socket.io-client'
const env_BaseURL = import.meta.env.VITE_BASE_URL

export const socket: Socket = io(env_BaseURL || 'http://localhost:3000', {
  // export const socket: Socket = io('http://localhost:3000', {
  transports: ['websocket']
})
