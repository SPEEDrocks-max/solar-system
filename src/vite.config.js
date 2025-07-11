// vite.config.js
export default {
  build: {
    chunkSizeWarningLimit: 2000, // increase limit to 2 MB or more
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // put all node_modules in one chunk named 'vendor'
            return 'vendor';
          }
        }
      }
    }
  }
}
