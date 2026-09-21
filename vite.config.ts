import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
const routes = JSON.parse(readFileSync(new URL('./content/routes.json', import.meta.url), 'utf8'));
export default defineConfig({
  appType: 'mpa',
  server: { host: '127.0.0.1' },
  build: { outDir: 'dist', rollupOptions: { input: Object.fromEntries(routes.map((route: string, i: number) => [`page${i}`, resolve(import.meta.dirname, route)])) } }
});
