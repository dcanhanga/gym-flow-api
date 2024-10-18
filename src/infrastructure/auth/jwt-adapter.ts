import jwt from 'jsonwebtoken';

import type { TokenGenerator } from '@/application/auth/token-generator';

class JWTAdapter implements TokenGenerator {
	constructor(private readonly secret: string) {}
	generateToken<T extends string | object | Buffer>(
		payload: T,
		expiresIn?: string | number,
	): string {
		return jwt.sign(payload, this.secret, {
			algorithm: 'HS256',
			expiresIn: expiresIn ?? '15m',
		});
	}
	verifyToken<T>(token: string): T | null {
		return jwt.verify(token, this.secret) as T;
	}
}

export { JWTAdapter };
