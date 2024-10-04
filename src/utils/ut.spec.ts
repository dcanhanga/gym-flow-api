interface IUserRepository {
	findByName(name: string): Promise<{ name: string; password: string } | null>;
}
interface IHasher {
	compare(password: string, hashedPassword: string): Promise<boolean>;
}
class LoginUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly hasher: IHasher,
	) {}

	async execute(name: string, password: string): Promise<boolean> {
		const user = await this.userRepository.findByName(name);

		if (!user) {
			return false; // Usuário não encontrado
		}

		const isPasswordCorrect = await this.hasher.compare(
			password,
			user.password,
		);

		return isPasswordCorrect; // True se a senha estiver correta, false caso contrário
	}
}
import { describe, expect, it, vi } from 'vitest';

// Stubs como classes
class UserRepositoryStub implements IUserRepository {
	findByName = vi
		.fn()
		.mockResolvedValue({ name: 'Domingos', password: 'hashed_password' });
}

class HasherStub implements IHasher {
	compare = vi.fn().mockResolvedValue(true); // Método simulado para comparar senhas
}

// Caso de uso
describe('LoginUseCase', () => {
	it('deve retornar true quando a senha estiver correta', async () => {
		// Arrange
		const userRepositoryStub = new UserRepositoryStub();
		const hasherStub = new HasherStub();

		const loginUseCase = new LoginUseCase(userRepositoryStub, hasherStub);

		// Criando o spy no método compare
		const compareSpy = vi.spyOn(hasherStub, 'compare').mockResolvedValue(true); // Simula senha correta

		// Act
		const result = await loginUseCase.execute('Domingos', 'senha123');

		// Assert
		expect(userRepositoryStub.findByName).toHaveBeenCalledWith('Domingos');
		expect(compareSpy).toHaveBeenCalledWith('senha123', 'hashed_password'); // Verifica se o spy foi chamado corretamente
		expect(result).toBe(true);
	});

	it('deve retornar false quando a senha estiver incorreta', async () => {
		// Arrange
		const userRepositoryStub = new UserRepositoryStub();
		const hasherStub = new HasherStub();

		const loginUseCase = new LoginUseCase(userRepositoryStub, hasherStub);

		// Criando o spy no método compare
		const compareSpy = vi.spyOn(hasherStub, 'compare').mockResolvedValue(false); // Simula senha incorreta

		// Act
		const result = await loginUseCase.execute('Domingos', 'senha123');

		// Assert
		expect(userRepositoryStub.findByName).toHaveBeenCalledWith('Domingos');
		expect(compareSpy).toHaveBeenCalledWith('senha123', 'hashed_password');
		expect(result).toBe(false);
	});
});
