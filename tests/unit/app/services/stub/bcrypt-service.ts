import type { BcryptService } from '@/app/services/protocols/bcrypt';

class BcryptServiceStub implements BcryptService {
	hash(_plaintext: string): Promise<string> {
		return Promise.resolve('hashed');
	}
	compare(_plaintext: string, _compareText: string): Promise<boolean> {
		return Promise.resolve(true);
	}
}
export { BcryptServiceStub };
