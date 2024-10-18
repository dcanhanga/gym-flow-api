import type { TokenGenerator } from '@/application/auth/token-generator';

class StubTokenGenerator implements TokenGenerator {
	generateToken<T>(_payload: T): string {
		return 'any_token';
	}
	verifyToken<T>(_token: string): T | null {
		return { userId: 'any_user_id' } as T;
	}
}

export { StubTokenGenerator };
