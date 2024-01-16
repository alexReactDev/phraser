export interface IUserInput {
	email: string,
	password: string
}

export interface IUser {
	id: string,
	email: string,
	password: string,
	isVerified: boolean,
	created: number
}