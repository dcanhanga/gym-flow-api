import { AuthMiddleware } from '@/presentation/middlewares/auth';
import { account } from '../use-cases/account';

export const authMiddleware = {
	admin: new AuthMiddleware(account.loadByToken(['ADMIN', 'MANAGER'])),
	private: new AuthMiddleware(account.loadByToken()),
};
