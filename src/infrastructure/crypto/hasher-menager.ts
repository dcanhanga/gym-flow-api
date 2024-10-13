import bcrypt from 'bcryptjs';

import type { HashManager } from '@/application/crypto/hash-manager';

class BcryptJSHashManager implements HashManager {
	private salt: number;
	constructor(salt?: number) {
		this.salt = salt ?? 12;
	}
	async hash(plaintext: string): Promise<string> {
		return bcrypt.hash(plaintext, this.salt);
	}
	async compare(plaintext: string, hashed: string): Promise<boolean> {
		return bcrypt.compare(plaintext, hashed);
	}
}
export { BcryptJSHashManager };
