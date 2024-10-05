export class ExpiredCheckInError extends Error {
	constructor() {
		super('Check-in cannot be validated after 20 minutes.');
		this.name = 'ExpiredCheckInError';
	}
}
