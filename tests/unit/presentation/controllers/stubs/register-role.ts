import type {
	Params,
	RegisterRole,
} from '@/application/use-cases/role/protocols/register';

class StubRegisterRoleUseCase implements RegisterRole {
	async register(_params: Params): Promise<void> {
		return;
	}
}
export { StubRegisterRoleUseCase };
