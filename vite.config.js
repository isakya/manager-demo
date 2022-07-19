import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import topLevelAwait from 'vite-plugin-top-level-await'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  // 配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 导入全局样式，注意不是App.vue里面导入的样式，那个是通用样式
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import '@/assets/style/base.scss';`
  //     }
  //   }
  // },
  plugins: [vue(),
  topLevelAwait({
    // The export name of top-level await promise for each chunk module
    promiseExportName: '__tla',
    // The function to generate import names of top-level await promise in each chunk module
    promiseImportName: i => `__tla_${i}`
  })
  ],
  base: './',
  server: {
    host: 'localhost',
    port: 8090,
    proxy: {
      '/api': {
        target: 'http://106.12.161.180:3000'
      }
    }
  }
})
