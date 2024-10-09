import type { BcryptService } from '@/application/services/protocols/bcrypt';

class StubBcryptService implements BcryptService {
	hash(_plaintext: string): Promise<string> {
		return Promise.resolve('hashedPassword');
	}
	compare(_plaintext: string, _compareText: string): Promise<boolean> {
		return Promise.resolve(true);
	}
}
export { StubBcryptService };
