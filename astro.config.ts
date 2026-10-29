import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://smturtle2.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
