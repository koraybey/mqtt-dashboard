import path from 'node:path'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), visualizer() as PluginOption],
    resolve: {
        // eslint-disable-next-line unicorn/prefer-module
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
})
