import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import slides from './build/slides'
import { join } from 'path'

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    }),
    slides({ owner: 'thezzisu-slides' })
  ],
  resolve: {
    alias: {
      src: join(__dirname, 'src'),
      app: __dirname
    }
  }
})
