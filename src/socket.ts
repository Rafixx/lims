// src/socket.ts
import { io, Socket } from 'socket.io-client'
import { env_BaseURL } from '../_old/shared/services/apiClient'

export const socket: Socket = io(env_BaseURL, {
  transports: ['websocket']
})
