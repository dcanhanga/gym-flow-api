import { prisma } from '@/infrastructure/repositories/prisma';
import { env } from './config/env';
import { app } from './config/fastify';

async function checkDatabaseConnection(retries = 5, delay = 2000) {
	for (let i = 0; i < retries; i++) {
		try {
			await prisma.$connect();
			console.log('Banco de dados conectado com sucesso!');
			return true;
		} catch (error) {
			console.error(`Tentativa ${i + 1} falhou:`, error);
			if (i < retries - 1) {
				await new Promise((res) => setTimeout(res, delay));
			}
		}
	}
	return false;
}

async function startServer() {
	const isDbConnected = await checkDatabaseConnection();

	if (isDbConnected) {
		app
			.listen({
				host: '0.0.0.0',
				port: env.PORT,
			})
			.then(() => console.log('HTTP server running!'))
			.catch((err) => {
				console.error('Erro ao iniciar o servidor:', err);
				process.exit(1);
			});
	} else {
		console.log(
			'Servidor não iniciado devido à falha na conexão com o banco de dados.',
		);
		process.exit(1);
	}
}

startServer();
