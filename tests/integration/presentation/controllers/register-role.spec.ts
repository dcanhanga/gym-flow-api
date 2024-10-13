import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/application/errors/message';
import type { RegisterRole } from '@/application/use-cases/interfaces/register-role';
import { RegisterRoleUseCase } from '@/application/use-cases/register-role';
import type { RegisterRoleValidator } from '@/application/validators/interfaces/register-role-validator';
import { ZodRegisterRoleValidator } from '@/infrastructure/validators/zod/register-role-validator';
import { RegisterRoleController } from '@/presentation/controllers/register-role';
import { messages as controllerMessage } from '@/presentation/helpers/messages';

import { InMemoryRoleRepository } from '../../in-memory-repository/role-repository';

const VALID_ROLES = ['ADMIN', 'USER', 'SUPER'] as const;
const HTTP_STATUS = {
	CREATED: 201,
	BAD_REQUEST: 400,
	CONFLICT: 409,
};

describe('RegisterRoleController - teste de integração', () => {
	let registerRoleUseCase: RegisterRole;
	let roleRepository: InMemoryRoleRepository;
	let roleValidator: RegisterRoleValidator;
	let sut: RegisterRoleController;

	function setup() {
		roleValidator = new ZodRegisterRoleValidator();
		roleRepository = new InMemoryRoleRepository();
		registerRoleUseCase = new RegisterRoleUseCase(
			roleRepository,
			roleValidator,
		);

		sut = new RegisterRoleController(registerRoleUseCase);
	}

	beforeEach(setup);

	afterEach(() => {
		roleRepository.clear();
	});

	describe('Caso de Sucessos', () => {
		it.each(VALID_ROLES)(
			'deve retornar 201 quando role for "%s"',
			async (role) => {
				const response = await sut.handle({ name: role });
				expect(response.statusCode).toStrictEqual(HTTP_STATUS.CREATED);
				expect(response.message).toStrictEqual(
					controllerMessage.ROLE_CREATED_SUCCESS,
				);
			},
		);
	});

	describe('Caso de erros', () => {
		it('deve retornar 400 quando o role for inválido', async () => {
			// @ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
			const response = await sut.handle({ name: 'INVALID' });

			expect(response.statusCode).toStrictEqual(HTTP_STATUS.BAD_REQUEST);
			expect(response.message).toStrictEqual(messages.INVALID_PARAMS);
			expect(response.errors).toStrictEqual({
				name: messages.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
			});
		});
		it('deve retornar quando o tiver campo nao previsto', async () => {
			// @ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
			const response = await sut.handle({ name: 'ADMIN', field: 'field' });

			expect(response.statusCode).toStrictEqual(HTTP_STATUS.BAD_REQUEST);
			expect(response.message).toStrictEqual(messages.INVALID_PARAMS);
			expect(response.errors).toStrictEqual({
				field: messages.UNRECOGNIZED_FIELD,
			});
		});
		it('deve retornar 409 quando o role já existir', async () => {
			const params = { name: 'ADMIN' } as const;
			await sut.handle(params);
			const response = await sut.handle(params);

			expect(response.statusCode).toStrictEqual(HTTP_STATUS.CONFLICT);
			expect(response.message).toStrictEqual(messages.ROLE_ALREADY_EXISTS);
		});
	});
});
