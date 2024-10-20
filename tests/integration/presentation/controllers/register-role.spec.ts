import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RegisterRoleService } from '@/application/services/register-role';
import { messages } from '@/domain/errors/message';
import { ZodRegisterRoleValidator } from '@/infrastructure/validators/zod/register-role-validator';
import { RegisterRoleController } from '@/presentation/controllers/register-role';
import { messages as controllerMessage } from '@/presentation/helpers/messages';
import { InMemoryRoleRepository } from '../../in-memory-repository/role-repository';

const VALID_ROLES = ['ADMIN', 'CLIENT', 'MANAGER'] as const;

describe('RegisterRoleController - teste de integração', () => {
	type InitTypes = {
		roleRepository: InMemoryRoleRepository;
		roleValidator: ZodRegisterRoleValidator;
		registerRoleUseCase: RegisterRoleService;
		sut: RegisterRoleController;
	};

	function init(): InitTypes {
		const roleValidator = new ZodRegisterRoleValidator();
		const roleRepository = new InMemoryRoleRepository();
		const registerRoleUseCase = new RegisterRoleService(
			roleRepository,
			roleValidator,
		);
		const sut = new RegisterRoleController(registerRoleUseCase);
		return {
			roleRepository,
			roleValidator,
			registerRoleUseCase,
			sut,
		};
	}
	let setup: InitTypes;

	beforeEach(() => {
		setup = init();
	});

	afterEach(() => {
		setup.roleRepository.clear();
	});

	describe('Caso de Sucessos', () => {
		it.each(VALID_ROLES)(
			'deve retornar 201 quando role for "%s"',
			async (role) => {
				const { sut } = setup;
				const response = await sut.handle({ name: role });
				expect(response.statusCode).toStrictEqual(201);
				expect(response.message).toStrictEqual(
					controllerMessage.ROLE_CREATED_SUCCESS,
				);
			},
		);
	});

	describe('Caso de erros', () => {
		it('deve retornar 400 quando o role for inválido', async () => {
			const { sut } = setup;
			// @ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
			const response = await sut.handle({ name: 'INVALID' });

			expect(response.statusCode).toStrictEqual(400);
			expect(response.message).toStrictEqual(messages.INVALID_INPUT_PARAMETERS);
			expect(response.errors).toStrictEqual({
				name: messages.ROLE_MUST_BE_MANAGER_ADMIN_OR_USER,
			});
		});
		it('deve retornar 400 quando o tiver campo nao previsto', async () => {
			const { sut } = setup;
			// @ts-ignore - Ignorando verificação de tipo para testar cenário de parâmetro inválido
			const response = await sut.handle({ name: 'ADMIN', field: 'field' });

			expect(response.statusCode).toStrictEqual(400);
			expect(response.message).toStrictEqual(messages.INVALID_INPUT_PARAMETERS);
			expect(response.errors).toStrictEqual({
				field: messages.UNRECOGNIZED_FIELD,
			});
		});
		it('deve retornar 409 quando o role já existir', async () => {
			const { sut } = setup;
			const params = { name: 'ADMIN' } as const;
			await sut.handle(params);
			const response = await sut.handle(params);

			expect(response.statusCode).toStrictEqual(409);
			expect(response.message).toStrictEqual(messages.ROLE_ALREADY_EXISTS);
		});
	});
});
