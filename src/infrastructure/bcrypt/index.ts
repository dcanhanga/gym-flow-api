import bcrypt from 'bcryptjs';

import type { BcryptService } from '@/application/services/protocols/bcrypt';

class BcryptJSService implements BcryptService {
	private salt: number;
	constructor(salt?: number) {
		this.salt = salt ?? 12;
	}
	hash(plaintext: string): Promise<string> {
		return bcrypt.hash(plaintext, this.salt);
	}
	compare(plaintext: string, compareText: string): Promise<boolean> {
		return bcrypt.compare(plaintext, compareText);
	}
}

export { BcryptJSService };
