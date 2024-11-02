import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/utils/messages.js';
import { uuidRegex } from '@/shared/utils/regex.js';
import { UUID } from '../value-object/uuid.js';

describe('UUID Value Object', () => {
	const validUUID = '550e8400-e29b-41d4-a716-446655440000';
	describe('Criação de UUID', () => {
		it('deve criar um UUID válido sem parâmetros', () => {
			const uuidResult = UUID.create();
			expect(uuidResult.isOk()).toBe(true);
			expect(uuidResult.unwrap().getValue()).toMatch(uuidRegex);
		});

		it('deve criar um UUID com um ID fornecido válido', () => {
			const uuidResult = UUID.create(validUUID);
			expect(uuidResult.isOk()).toBe(true);
			expect(uuidResult.unwrap().getValue()).toBe(validUUID);
		});

		it('deve falhar ao criar UUID com formato inválido', () => {
			const invalidUUID = 'invalid-uuid';
			const uuidResult = UUID.create(invalidUUID);
			expect(uuidResult.isFail()).toBe(true);
			expect(uuidResult.unwrapError().message).toBe(
				messages.INVALID_UUID_FORMAT,
			);
		});
	});

	describe('Comparação de UUIDs', () => {
		it('deve comparar dois UUIDs iguais corretamente', () => {
			const uuid1Result = UUID.create(validUUID);
			const uuid2Result = UUID.create(validUUID);

			expect(uuid1Result.unwrap().equals(uuid2Result.unwrap())).toBe(true);
		});

		it('deve comparar dois UUIDs diferentes corretamente', () => {
			const uuid1Result = UUID.create();
			const uuid2Result = UUID.create();

			expect(uuid1Result.unwrap().equals(uuid2Result.unwrap())).toBe(false);
		});
	});
});
