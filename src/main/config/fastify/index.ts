import cookie, { type FastifyCookieOptions } from '@fastify/cookie';
import Fastify from 'fastify';

import { setupRoutes } from './routes-config';

export const app = Fastify();
app.register(cookie, {
	secret: 'my-secret',
} as FastifyCookieOptions);
app.ready(() => {
	app.hasPlugin('@fastify/cookie'); // true
});
app.register(setupRoutes, { prefix: '/api' });
