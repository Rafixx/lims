// src/setupTests.ts

import '@testing-library/jest-dom'
// import { server } from './mocks/server'
// Configura el servidor MSW con los manejadores de petición.
import { server } from './mocks/server'

// Inicia MSW antes de correr cualquier test.
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
// Reinicia los handlers después de cada test para que no haya efectos secundarios.
afterEach(() => server.resetHandlers())
// Cierra el servidor MSW al terminar los tests.
afterAll(() => server.close())
