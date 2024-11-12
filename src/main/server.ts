import { Region } from '@/modules/region/infrastructure/model.js';
import { Point } from '@/shared/core/value-object/point.js';
import { Polygon } from '@/shared/core/value-object/polygon.js';

import mongoose from 'mongoose';
import { env } from './config/env/config.js';
import { app } from './config/fastify/app.js';

async function createAndSaveRegion() {
	const polygon = Polygon.create([
		{ lon: -3.465, lat: -60.701 },
		{ lon: -3.468, lat: -60.698 },
		{ lon: -3.467, lat: -60.702 },
		{ lon: -3.465, lat: -60.701 },
	]).unwrap.toNestedArray;
	const point = Point.create({ lat: -60.701, lon: -3.465 }).unwrap.toArray;
	console.log({ polygon, point });
	const regionInput = {
		name: 'Teste',
		country: 'Pais do teste',
		midpoint: {
			type: 'Point',
			coordinates: point, // Ponto (longitude, latitude)
		},
		coordinates: {
			type: 'Polygon',
			coordinates: polygon,
		},
	};

	const region = new Region(regionInput);

	try {
		await region.save();
		console.log('Região salva com sucesso:', region);
	} catch (err) {
		console.error('Erro ao salvar a região:', err);
	}
}
class Server {
	static async checkDatabaseConnection() {
		const retries = 5;
		const delay = 2000;

		for (let i = 0; i < retries; i++) {
			try {
				await mongoose.connect(env.DATABASE_URL);
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

	static async startServer() {
		const isDbConnected = await Server.checkDatabaseConnection();

		if (!isDbConnected) {
			console.log(
				'Servidor não iniciado devido à falha na conexão com o banco de dados.',
			);
			process.exit(1);
		}

		try {
			const port = env.PORT;
			await app.listen({
				host: '0.0.0.0',
				port,
			});
			console.log(`HTTP server running on port ${port}!`);
			await createAndSaveRegion();
		} catch (error) {
			console.error('Erro ao iniciar o servidor:', error);
			process.exit(1);
		}
	}

	static async shutdown() {
		try {
			await mongoose.disconnect();
			console.log('Conexão com o banco de dados encerrada.');
			process.exit(0);
		} catch (error) {
			console.error('Erro ao encerrar a conexão:', error);
			process.exit(1);
		}
	}
}
process.on('SIGINT', Server.shutdown);
process.on('SIGTERM', Server.shutdown);

Server.startServer();
