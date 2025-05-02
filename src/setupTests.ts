import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Sin usar `namespace` ni `any`, y sin redefinir interfaces
Object.defineProperty(globalThis, 'TextEncoder', {
  value: TextEncoder,
  configurable: true,
  writable: true
})

Object.defineProperty(globalThis, 'TextDecoder', {
  value: TextDecoder,
  configurable: true,
  writable: true
})
