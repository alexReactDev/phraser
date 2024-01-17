export interface ILoginInput {
	email: string,
	password: string
}

export interface IJWT {
	iat: number,
	sid: string | number,
	userId: string
}

export interface IChangePasswordInput {
	oldPassword: string,
	newPassword: string
}