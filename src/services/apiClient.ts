// src/services/apiClient.ts
import axios from 'axios'
const env_BaseURL = import.meta.env.VITE_BASE_URL

export const apiClient = axios.create({
  // baseURL: 'http://localhost:3000/api' // Ajusta la URL de tu API
  baseURL: env_BaseURL // Ajusta la URL de tu API
})
