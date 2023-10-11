export interface IAuthData {
	sid: number,
	token: string,
	userId: number
}

export interface IAuthInitialData {
	sid: number | null,
	token: string | null,
	userId: number | null
}