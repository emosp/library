/*
 * @Author: flkGit
 * @Date: 2025-10-22 10:15:13
 * @LastEditors: flkGit
 * @LastEditTime: 2025-10-22 11:58:57
 * @FilePath: /emos_library/vite.config.js
 * @Description:
 *
 * Copyright (c) 2025 by flkGit, All Rights Reserved.
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 4396,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Element Plus UI 库
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
        },
      },
    },
  },
})
