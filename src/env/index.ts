import z from 'zod';

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
});

const { success, data, error } = envSchema.safeParse(process.env);
if (success === false) {
	console.error('Environment variables are not set', error.errors);
	throw new Error('Environment variables are not set');
}

export const env = data;
