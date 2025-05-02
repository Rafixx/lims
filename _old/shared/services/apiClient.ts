// src/shared/services/apiClient.ts
import axios from 'axios'
import { BASE_URL } from '../../../src/shared/constants'

export const apiClient = axios.create({
  baseURL: BASE_URL
})
