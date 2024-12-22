import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: '192.168.100.12', // Use your local IP address here
  //   port: 5173, // Default port, can be changed if needed
  // }
})
