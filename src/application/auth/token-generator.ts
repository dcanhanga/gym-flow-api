export interface TokenGenerator {
	generateToken<T extends string | object | Buffer>(payload: T): string;
	verifyToken<T>(token: string, expiresIn?: string | number): T | null;
}
