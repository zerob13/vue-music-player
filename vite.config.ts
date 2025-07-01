import Vue from '@vitejs/plugin-vue'
/// <reference types="vitest" />

import UnpluginClassExtractor from 'unplugin-class-extractor/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { name } from './package.json'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = '/'
  let plugins = [
    Vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
    }),
    Pages(),
    Components(),
  ]

  let build: Record<string, any> = {
    target: 'es2015',
    cssTarget: 'chrome61',
  }

  if (mode === 'npm') {
    plugins = [
      Vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: true,
    }),
    Pages(),
    Components(),
      dts({
        outDir: 'dist/types',
      }),
      UnpluginClassExtractor({
        output: 'dist/tailwind.ts',
        include: [
          /\/src\/components\/(?:[^/]+\/)*[^/]+\.vue(\?.*)?$/,
        ],
      }) as any,
    ]
    build = {
      target: 'es2015',
      cssTarget: 'chrome61',
      copyPublicDir: false,
      lib: {
        entry: './src/exports.ts',
        formats: ['cjs', 'es'],
        name,
        fileName: 'index',
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
          exports: 'named',
        },
      },
    }
  }

  return {
    base,
    plugins,
    build,
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
