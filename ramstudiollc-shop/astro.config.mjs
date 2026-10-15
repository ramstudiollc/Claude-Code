// @ts-check
import { defineConfig } from 'astro/config';

// Static site. Every "Buy" button leaves for Gumroad, so no server is needed.
export default defineConfig({
  site: 'https://ramstudiollc.shop',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
