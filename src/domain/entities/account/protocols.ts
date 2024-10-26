// import type {
// 	CreateAccountValidationResultDto,
// 	RegisterAccountDto,
// } from '@/domain/dto/account';

// type Params = {
// 	id?: string;
// 	name: string;
// 	email: string;
// 	password: string;
// 	avatarUrl: string | null;
// 	roleId: string;
// };
// type OldParams = Params;
// type NewParams = {
// 	name: string;
// 	email: string;
// 	password: string;
// };
// type UpdateParams = {
// 	oldParams: OldParams;
// 	newParams: NewParams;
// };

// interface Validator {
// 	create(
// 		params: Omit<RegisterAccountDto, 'roleId'>,
// 	): CreateAccountValidationResultDto;
// 	roleId(roleId: string): string;
// 	// update(params: Record<string, unknown>): NewParams;
// }

// export type { Params, Validator, UpdateParams, NewParams, OldParams };
