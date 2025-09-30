// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const processEnv = Object.keys(env)
    .filter(key => key.startsWith('VITE_'))
    .reduce(
      (acc, key) => {
        const newKey = key.replace(/^VITE_/, '')
        acc[`process.env.${newKey}`] = JSON.stringify(env[key])
        return acc
      },
      {} as Record<string, string>
    )

  return {
    // 🔴 CLAVE: base por entorno. Para Hostinger debe ser /lims/
    base: env.VITE_APP_BASE || '/',
    plugins: [react(), tsconfigPaths()],
    define: processEnv
  }
})
