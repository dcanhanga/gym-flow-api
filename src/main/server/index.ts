import { env } from '../env/config';
import { app } from '../fastify';

app
	.listen({
		host: '0.0.0.0',
		port: env.PORT,
	})
	.then(() => console.log('HTTP server running!'));
