// jest.importmeta.cjs
// Custom Jest transform: replaces Vite's import.meta.env.* before ts-jest
// compiles TypeScript, since import.meta is not valid in CommonJS mode.
/* global module, require */
const { TsJestTransformer } = require('ts-jest')

const transformer = new TsJestTransformer({})

const VITE_ENV = {
  VITE_BASE_URL: 'http://localhost:3002/api',
  VITE_TOKEN_KEY: 'LIMS_TOKEN',
  BASE_URL: '/',
  MODE: 'test',
  DEV: 'false',
  PROD: 'false',
  SSR: 'false'
}

function replaceImportMeta(source) {
  return source.replace(/import\.meta\.env\.(\w+)/g, (_, key) => {
    const val = VITE_ENV[key]
    return val !== undefined ? JSON.stringify(val) : 'undefined'
  })
}

module.exports = {
  process(sourceText, sourcePath, options) {
    return transformer.process(replaceImportMeta(sourceText), sourcePath, options)
  },
  processAsync(sourceText, sourcePath, options) {
    return transformer.processAsync(replaceImportMeta(sourceText), sourcePath, options)
  },
  getCacheKey(sourceText, sourcePath, options) {
    return transformer.getCacheKey(replaceImportMeta(sourceText), sourcePath, options)
  },
  getCacheKeyAsync(sourceText, sourcePath, options) {
    return transformer.getCacheKeyAsync(replaceImportMeta(sourceText), sourcePath, options)
  }
}
