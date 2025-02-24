// src/tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { env_BaseURL } from '../services/apiClient'

export const handlers = [
  http.get(`${env_BaseURL}/api/muestras`, () => {
    return HttpResponse.json([
      {
        id: 1,
        codigoInterno: 'M001',
        estado: 'Pendiente'
      }
    ])
  }),
  http.get(`${env_BaseURL}/api/user`, () => {
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick'
    })
  })
]
