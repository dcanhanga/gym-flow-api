import { LoadAccountByTokenService } from '@/application/services/load-account-by-token';
import { auth } from '../auth';
import { repository } from '../repositories';
import { validator } from '../validators/account';

function loadByToken(roles?: string[]) {
	return new LoadAccountByTokenService(
		repository.account,
		repository.role,
		auth.jwt,
		validator.loadAccountByTokenValidator(),
		roles,
	);
}
export const account = {
	loadByToken,
};
