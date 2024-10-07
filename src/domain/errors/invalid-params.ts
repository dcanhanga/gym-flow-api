type KeyValue = Record<string, string>;

class InvalidParams extends Error {
	errors: KeyValue; // Agora aceita erros como chave-valor de string
	constructor(message: string, errors: KeyValue) {
		super(message);
		this.name = 'InvalidParams'; // Corrigido o nome
		this.errors = errors;
	}
}

export { InvalidParams };
