import { cloudflare } from '@cloudflare/vite-plugin'
import { cdnAdapter } from '@vinext/cloudflare/cache/cdn-adapter'
import { imagesOptimizer } from '@vinext/cloudflare/images/images-optimizer'
import vinext from 'vinext'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vinext({
      cache: { cdn: cdnAdapter() },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: 'rsc',
        childEnvironments: ['ssr'],
      },
    }),
  ],
})
