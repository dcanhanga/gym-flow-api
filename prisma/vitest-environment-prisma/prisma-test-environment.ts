import { randomUUID } from 'node:crypto';
import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';
import type { Environment } from 'vitest/environments';

const prisma = new PrismaClient();

function generateDatabaseURL(database: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('Please provide a DATABASE_URL environment variable.');
	}

	const url = new URL(process.env.DATABASE_URL);
	url.pathname = `/${database}`; // Define o nome do banco de dados como caminho na URL.

	return url.toString();
}

export default (<Environment>{
	name: 'prisma',
	async setup() {
		const databaseName = `test_db_${randomUUID()}`; // Define o nome de um banco de dados temporário.
		const databaseURL = generateDatabaseURL(databaseName);

		process.env.DATABASE_URL = databaseURL;

		// MongoDB não exige migrações da mesma forma que PostgreSQL. Para criação do banco, basta conectar.
		await prisma.$connect();

		return {
			async teardown() {
				const client = new MongoClient(databaseURL); // Conecta usando o cliente MongoDB
				await client.connect();

				const db = client.db(databaseName);

				// Obtém todas as coleções e as remove uma por uma
				const collections = await db.listCollections().toArray();
				for (const { name } of collections) {
					await db.collection(name).drop();
				}

				await client.close();
				await prisma.$disconnect();
			},
		};
	},
	transformMode: 'ssr',
});
