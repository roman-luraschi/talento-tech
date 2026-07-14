import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const FIREBASE_VERSION = '12.16.0'
const FIREBASE_CDN: Record<string, string> = {
  'firebase/app': `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`,
  'firebase/auth': `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`,
  'firebase/firestore': `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`,
}

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    build: {
      rollupOptions: {
        external: isBuild ? Object.keys(FIREBASE_CDN) : undefined,
        output: {
          paths: isBuild ? FIREBASE_CDN : undefined,
          manualChunks(id) {
            if (
              id.includes('/src/firestore/config/') ||
              id.endsWith('/src/firestore/config/index.ts') ||
              id.endsWith('\\src\\firestore\\config\\index.ts')
            ) {
              return 'firebase-config'
            }
          },
        },
      },
    },
  }
})
