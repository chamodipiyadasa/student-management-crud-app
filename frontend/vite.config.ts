import { defineConfig } from 'vite'

// Use a dynamic import for ESM-only plugins to avoid require/ESM interop issues
export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default

  return {
    plugins: [react()],
    server: { port: 5173 },
    resolve: { alias: [] },
  }
})
