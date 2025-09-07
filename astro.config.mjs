// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import packageJson from './package.json' assert { type: 'json' };

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [react()],
  vite: {
    define: {
      __VERSION__: JSON.stringify(packageJson.version)
    },
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url)
      }
    }
  }
});