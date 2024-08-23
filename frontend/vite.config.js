import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite conexões de todas as interfaces
    port: 5173,        // Porta em que o Vite deve escutar
    strictPort: true,  // Garante que a porta especificada seja usada
    watch: {
      usePolling: true,
    },
  },
})
