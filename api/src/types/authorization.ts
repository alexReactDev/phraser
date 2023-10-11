export interface ILoginInput {
	login: string,
	password: string
}

export interface ISignUpInput {
	login: string,
	password: string,
	name: string
}

export interface IJWT {
	login: string,
	iat: number,
	sid: string | number,
	userId: number
}