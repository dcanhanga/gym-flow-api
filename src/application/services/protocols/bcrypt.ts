interface BcryptService {
	hash(plaintext: string): Promise<string>;
	compare(plaintext: string, compareText: string): Promise<boolean>;
}
export type { BcryptService };
