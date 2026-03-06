import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // Bundle analyzer (enabled via ANALYZE=true env variable)
    mode === 'production' && process.env.ANALYZE === 'true' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production', // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks more aggressively for better caching
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'vendor-react';
            }
            // Animation libraries
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-animation';
            }
            // 3D libraries (heavy - load only when needed)
            if (id.includes('three') || id.includes('@react-three') || id.includes('@splinetool')) {
              return 'vendor-3d';
            }
            // Video/Chat SDK (very heavy - load only on conference pages)
            if (id.includes('@stream-io') || id.includes('stream-chat')) {
              return 'vendor-stream';
            }
            // UI component libraries
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // Charts (heavy - load only on dashboard)
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // Other vendors
            return 'vendor';
          }
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Tree-shaking optimizations
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false,
      },
    },
    chunkSizeWarningLimit: 600, // Reduced from 800KB to catch large chunks
    reportCompressedSize: true,
    // Target modern browsers
    target: 'es2020',
    // CSS optimization
    cssCodeSplit: true,
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb
  },
  server: {
    port: 3000,
    host: true,
  },
  // Environment variables
  define: {
    __DEV__: mode !== 'production',
    __PERF_MONITORING__: process.env.PERF_MONITORING === 'true',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}))