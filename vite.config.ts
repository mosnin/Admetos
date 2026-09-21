import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  appType: 'mpa',
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  build: {
    outDir: 'dist',
    rollupOptions: { input: { home: resolve(import.meta.dirname,'index.html'), story: resolve(import.meta.dirname,'mission/index.html'), ventures: resolve(import.meta.dirname,'projects/index.html'), writing: resolve(import.meta.dirname,'lab/index.html'), contact: resolve(import.meta.dirname,'contact/index.html') } },
  },
});
