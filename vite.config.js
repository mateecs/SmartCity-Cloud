import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
// import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.png'],
  
  plugins: [
  /*  inject({
            $: 'jquery',
            jQuery: 'jquery'
        }),*/
    vue(),
    
  ],
  resolve: {
    alias: {
      //vue: 'vue/dist/vue.esm.js',
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'src': fileURLToPath(new URL('./src', import.meta.url)),
      'components': fileURLToPath(new URL('./src/components', import.meta.url)),
      'assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      'repo': fileURLToPath(new URL('./src/repo', import.meta.url)),
      // compatibility with vue-cli sass and node_module imports (since tilde is not supported by vite)
      '~bootstrap': 'bootstrap',
      '~bootstrap-vue': 'bootstrap-vue'

      // use jquery.slim instead of the full jquery at all places
      //jquery: 'jquery/dist/jquery.slim.min.js'
    },
  }
})