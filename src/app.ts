import fastify from 'fastify';

import { ZodError } from 'zod';
import { env } from './env';
import { appRoutes } from './http/routes';

export const app = fastify();
app.register(appRoutes);
app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		reply.status(400).send({
			message: 'Validations error',
			issues: error.format(),
		});
	}
	if (env.NODE_ENV !== 'production') {
		console.error(error);
	}
});

// interface ErrorStructure {
// 	_errors: string[];
// 	[key: string]: any;
// }

// function transformErrors(structure: ErrorStructure): any {
// 	const newStructure: any = {};

// 	for (const key in structure) {
// 		if (key === '_errors' && structure[key].length === 0) {
// 			continue; // Remove o campo _errors se estiver vazio
// 		}

// 		if (key === '_errors') {
// 			newStructure['errors'] = structure[key]; // Renomeia _errors para errors
// 		} else if (typeof structure[key] === 'object' && structure[key] !== null) {
// 			// Verifica se é um objeto e aplica a função recursivamente
// 			newStructure[key] = transformErrors(structure[key]);
// 		} else {
// 			newStructure[key] = structure[key];
// 		}
// 	}

// 	return newStructure;
// }

// Exemplo de uso
// const structure = {
// 	_errors: [],
// 	email: {
// 		_errors: ['Invalid email'],
// 	},
// 	password: {
// 		_errors: ['Required'],
// 	},
// };

// const transformedStructure = transformErrors(structure);
// console.log(transformedStructure);
