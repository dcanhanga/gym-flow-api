import { app } from './app';
import { env } from './env/config';

app
	.listen({
		host: '0.0.0.0',
		port: env.PORT,
	})
	.then((address: string) => {
		console.log(`Server is running on ${address}`);
	})
	.catch((err: Error) => {
		console.error(err);
		process.exit(1);
	});
