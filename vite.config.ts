import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

// Library build: ES + CJS, types rolled into one .d.ts, React externalised,
// CSS Modules emitted into a single dist/style.css alongside dist/styles.css
// (the token bundle, copied in by the build script).
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], rollupTypes: true, exclude: ['**/*.stories.tsx'] }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (fmt) => `index.${fmt === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
});
