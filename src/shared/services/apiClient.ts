// src/shared/services/apiClient.ts
import axios from 'axios'
export const env_BaseURL = import.meta.env.VITE_BASE_URL
//export const env_BaseURL = 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: env_BaseURL
})
