import { JWTAdapter } from '@/infrastructure/auth/jwt-adapter';
import { env } from '@/main/config/env';

const jwt = new JWTAdapter(env.JWT_SECRET_KEY);
export const auth = {
	jwt,
};
