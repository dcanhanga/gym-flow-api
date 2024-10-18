import { JWTAdapter } from '@/infrastructure/auth/jwt-adapter';
import jwt from 'jsonwebtoken';
import { describe, expect, it, vi } from 'vitest';

describe('Auth: JWTAdapter - teste unitário', () => {
	function setup() {
		const sut = new JWTAdapter('teste-jwt');
		return { sut };
	}

	describe('casos de sucesso', () => {
		it('deve gerar um token válido', () => {
			const { sut } = setup();
			const payload = { id: 'user123' };

			const token = sut.generateToken(payload, '1h');

			expect(token).toBeDefined();
			expect(token).toBeTypeOf('string');
		});

		it('deve verificar um token válido', () => {
			const { sut } = setup();
			const payload = { id: 'user123' };

			const token = sut.generateToken(payload, '1h');
			const decoded = sut.verifyToken<{ id: string }>(token);

			expect(decoded).toMatchObject(payload);
		});
	});

	describe('casos de erros', () => {
		it('deve lançar um erro se o payload for inválido para gerar o token', () => {
			const { sut } = setup();
			//@ts-ignore forçando entrada de dados inválidos
			expect(() => sut.generateToken<number>(123, '1h')).toThrowError();
		});
		it('deve lançar um erro se o token for inválido ou expirado', () => {
			const { sut } = setup();
			const invalidToken = 'invalid_token';

			expect(() => sut.verifyToken(invalidToken)).toThrowError();
		});

		it('deve lançar um erro se o jwt.sign lançar um erro', () => {
			const { sut } = setup();
			vi.spyOn(jwt, 'sign').mockImplementation(() => {
				throw new Error();
			});

			expect(() => sut.generateToken({ id: 'test' }, '1h')).toThrowError();
		});

		it('deve lançar um erro se o jwt.verify lançar um erro', () => {
			const { sut } = setup();

			vi.spyOn(jwt, 'verify').mockImplementation(() => {
				throw new Error();
			});

			expect(() => sut.verifyToken('invalid_token')).toThrowError();
		});
	});
});
