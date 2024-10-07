import type {
	ErrorResponse,
	RegisterAccountServiceValidator,
} from '@/app/services/protocols/register-account-service-validator';
import type { RegisterAccountUseCase } from '@/domain/use-cases/register-account';

class RegisterAccountValidatorStub implements RegisterAccountServiceValidator {
	validate(_data: RegisterAccountUseCase.Params): ErrorResponse | null {
		return null;
	}
}
export { RegisterAccountValidatorStub };
