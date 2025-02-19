// jest.config.cjs
/* global module */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Mueve la configuración de ts-jest al campo transform
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }]
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy'
  }
}
