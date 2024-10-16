import type { HashManager } from '@/application/crypto/hash-manager';

class StubBcryptService implements HashManager {
	hash(_plaintext: string): Promise<string> {
		return Promise.resolve('hashedPassword');
	}
	compare(_plaintext: string, _compareText: string): Promise<boolean> {
		return Promise.resolve(true);
	}
}
export { StubBcryptService };
