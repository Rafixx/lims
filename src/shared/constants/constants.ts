export const BASE_URL = (import.meta.env.VITE_BASE_URL as string) || 'http://localhost:3002/api'
export const TOKEN_KEY = (import.meta.env.VITE_TOKEN_KEY as string) || 'LIMS_TOKEN'
export const STALE_TIME = 5 * 60 * 1000 // 5 minutos
export const GC_TIME = 30 * 60 * 1000 // 30 minutos (antes cacheTime)
