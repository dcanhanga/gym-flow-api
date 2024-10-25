interface HashManager {
	hash(plaintext: string): Promise<string>;
	compare(plaintext: string, hashed: string): Promise<boolean>;
}

export type { HashManager };
