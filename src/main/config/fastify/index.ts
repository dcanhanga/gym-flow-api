import Fastify from 'fastify';

import cookie, { type FastifyCookieOptions } from '@fastify/cookie';
import { setupRoutes } from './routes-config.js';

export const app = Fastify();
app.register(cookie, {
	secret: 'my-secret', // for cookies signature
	parseOptions: {}, // options for parsing cookies
} as FastifyCookieOptions);
app.ready(() => {
	app.hasPlugin('@fastify/cookie'); // true
});
app.register(setupRoutes, { prefix: '/api' });
