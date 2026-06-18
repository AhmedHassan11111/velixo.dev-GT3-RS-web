import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'serve-ezgif-assets',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && (req.url.startsWith('/ezgif-85116182a5dc7c12-jpg/') || req.url.startsWith('/herosection/'))) {
              const decodedUrl = decodeURIComponent(req.url);
              const filename = path.basename(decodedUrl.split('?')[0]);
              
              // 1. Check in root /ezgif-85116182a5dc7c12-jpg directory
              const rootEzgifDir = path.resolve(__dirname, 'ezgif-85116182a5dc7c12-jpg');
              const possiblePath1 = path.join(rootEzgifDir, filename);

              // 2. Check in /public/herosection directory
              const publicHerosectionDir = path.resolve(__dirname, 'public', 'herosection');
              const possiblePath2 = path.join(publicHerosectionDir, filename);

              // 3. Check in public/ezgif-85116182a5dc7c12-jpg directory
              const publicEzgifDir = path.resolve(__dirname, 'public', 'ezgif-85116182a5dc7c12-jpg');
              const possiblePath3 = path.join(publicEzgifDir, filename);

              let fileToServe = '';
              if (fs.existsSync(possiblePath1) && fs.statSync(possiblePath1).isFile()) {
                fileToServe = possiblePath1;
              } else if (fs.existsSync(possiblePath2) && fs.statSync(possiblePath2).isFile()) {
                fileToServe = possiblePath2;
              } else if (fs.existsSync(possiblePath3) && fs.statSync(possiblePath3).isFile()) {
                fileToServe = possiblePath3;
              }

              if (fileToServe) {
                res.setHeader('Content-Type', 'image/jpeg');
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                fs.createReadStream(fileToServe).pipe(res);
                return;
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
