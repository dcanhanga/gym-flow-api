import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { errorMessage } from '@/application/message/error-message';
import type { RegisterAccount } from '@/application/use-cases/interfaces/register-account';
import { RegisterAccountUseCase } from '@/application/use-cases/register-account';
import { BcryptService } from '@/infrastructure/bcrypt';
import { ZodRegisterAccountValidatorService } from '@/infrastructure/validators/zod/zod-register-account-validator';
import { RegisterAccountController } from '@/presentation/controllers/register-account';
import { generateAccountToRegister } from '@/tests/utils/generate-account-to-register';
import { InMemoryRegisterAccountRepository } from '../../infrastructure/in-memory-repository/register-account-repository';
import { InMemoryRoleRepository } from '../../infrastructure/in-memory-repository/role-repository';

describe('Register account controller', () => {
	let sut: RegisterAccountController;
	let registerAccountUseCase: RegisterAccount;
	let registerAccountRepository: InMemoryRegisterAccountRepository;
	let roleRepository: InMemoryRoleRepository;
	let bcrypt: BcryptService;
	let registerAccountValidator: ZodRegisterAccountValidatorService;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let request: any;
	beforeEach(() => {
		registerAccountRepository = new InMemoryRegisterAccountRepository();
		roleRepository = new InMemoryRoleRepository();
		bcrypt = new BcryptService();
		registerAccountValidator = new ZodRegisterAccountValidatorService();

		registerAccountUseCase = new RegisterAccountUseCase(
			registerAccountRepository,
			roleRepository,
			bcrypt,
			registerAccountValidator,
		);
		sut = new RegisterAccountController(registerAccountUseCase);
		roleRepository.addRole('user');
	});
	afterEach(() => {
		roleRepository.clear();
		registerAccountRepository.clear();
	});
	describe('Caso de erro', () => {
		it('deve retornar bad request quando os dados de entrada estiverem inválidos', async () => {
			const invalidParams = {
				email: errorMessage.INVALID_EMAIL,
				name: errorMessage.NAME_MUST_BE_A_STRING,
				password: errorMessage.PASSWORD_IS_REQUIRED,
				role: errorMessage.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
			};

			request = {
				email: 'invalid-email',
				name: {},
				role: {},
			};

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(400);
			expect(response.errors).toStrictEqual(invalidParams);
		});
		it('deve retornar bad request se a requisição for um objeto vazio', async () => {
			//@ts-ignore
			// A intenção é testar se o controller retorna um erro quando o objeto de requisição é vazio, por isso usei o @ts-ignore
			const response = await sut.handle({});

			expect(response.statusCode).toStrictEqual(400);
			expect(response.errors).toStrictEqual({
				email: errorMessage.EMAIL_IS_REQUIRED,
				name: errorMessage.NAME_IS_REQUIRED,
				password: errorMessage.PASSWORD_IS_REQUIRED,
				role: errorMessage.ROLE_MUST_BE_USER_OR_ADMIN_OR_SUPER,
			});
		});
		it('deve retornar bad request se parâmetros inesperados forem passados', async () => {
			const request = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'user',
				unexpectedParam: 'value',
			};

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(400);
			expect(response.errors).toStrictEqual({
				unexpectedParam: errorMessage.UNRECOGNIZED_FIELD,
			});
		});

		it('deve retornar conflict se account email cadastrado existir', async () => {
			request = generateAccountToRegister('super');
			registerAccountRepository.register(request);

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(409);
			expect(response.message).toStrictEqual(errorMessage.EMAIL_ALREADY_EXISTS);
		});
		it('deve retornar not found quando o role fornecido nao existir', async () => {
			request = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'admin',
			};

			const response = await sut.handle(request);

			expect(response.statusCode).toStrictEqual(404);
			expect(response.message).toStrictEqual(errorMessage.ROLE_NOT_FOUND);
		});
		it('deve retornar server error se o repositório lançar um erro inesperado', async () => {
			//@ts-ignore
			// A intenção de simular um erro inesperado, por isso usei o ts-ignore
			const response = await sut.handle(null);

			expect(response.statusCode).toStrictEqual(500);
			expect(response.message).toStrictEqual(
				errorMessage.INTERNAL_SERVER_ERROR,
			);
		});
	});
	describe('Caso de sucesso', () => {
		it('deve retornar created quando o cadastro de account for bem sucedido', async () => {
			const request = {
				email: 'dominique@gmail.com',
				password: '123456A@',
				name: 'Dominique',
				role: 'user',
			};

			const response = await sut.handle(request);
			expect(response.statusCode).toStrictEqual(201);
			expect(response.data).toStrictEqual(null);
		});
	});
});
