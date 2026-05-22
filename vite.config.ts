import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { stateApiMiddleware } from './server/stateFile';

function statePersistencePlugin(): Plugin {
  return {
    name: 'state-persistence',
    configureServer(server) {
      server.middlewares.use(stateApiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(stateApiMiddleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), statePersistencePlugin()],
});
