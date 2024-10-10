import type { Bcrypt } from '@/application/services/interfaces/bcrypt';

class StubBcryptService implements Bcrypt {
	hash(_plaintext: string): Promise<string> {
		return Promise.resolve('hashedPassword');
	}
	compare(_plaintext: string, _compareText: string): Promise<boolean> {
		return Promise.resolve(true);
	}
}
export { StubBcryptService };
