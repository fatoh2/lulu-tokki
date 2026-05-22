import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Keep Vite cache outside of OneDrive to avoid EPERM errors from sync locking
export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: 'C:/Users/fatoh/AppData/Local/vite-cache/korean-snacks-store',
  server: { port: 5174 },
  build: {
    rollupOptions: {
      output: {
        // Split heavy dependencies into their own long-cached chunks.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase'
            if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          }
        },
      },
    },
  },
})
