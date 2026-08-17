import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        historia: resolve(__dirname, 'historia.html'),
        noticias: resolve(__dirname, 'noticias.html'),
        registro: resolve(__dirname, 'registro.html'),
        login: resolve(__dirname, 'login.html'),
        comunicados: resolve(__dirname, 'comunicados.html'),
        carguenoticias: resolve(__dirname, 'carguenoticias.html'),
        juntadirectiva: resolve(__dirname, 'juntadirectiva.html'),
        formulario: resolve(__dirname, 'formulario-sindegeologico.html'),
      },
    },
  },
})