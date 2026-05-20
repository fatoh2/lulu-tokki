import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Keep Vite cache outside of OneDrive to avoid EPERM errors from sync locking
export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: 'C:/Users/fatoh/AppData/Local/vite-cache/korean-snacks-store',
  server: { port: 5174 },
})
