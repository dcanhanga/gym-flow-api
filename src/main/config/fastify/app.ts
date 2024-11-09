import Fastify from 'fastify';
import { setupRoutes } from './routes-config.js';

export const app = Fastify();
// app.register(setupRoutes, { prefix: '/api' });
