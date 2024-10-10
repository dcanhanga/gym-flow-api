import bcrypt from 'bcryptjs';

import type { Bcrypt } from '@/application/services/interfaces/bcrypt';

class BcryptService implements Bcrypt {
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

export { BcryptService };
