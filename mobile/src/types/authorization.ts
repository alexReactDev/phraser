export interface IAuthData {
	sid: number,
	token: string,
	userId: string
}

export interface IAuthInitialData {
	sid: number | null,
	token: string | null,
	userId: string | null
}