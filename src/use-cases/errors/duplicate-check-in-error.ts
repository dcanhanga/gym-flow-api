export class DuplicateCheckInError extends Error {
	constructor() {
		super('Você já fez check-in hoje.');
		this.name = 'DuplicateCheckInError';
	}
}
