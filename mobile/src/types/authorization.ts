import { AuthType } from "@ts/authorization";
export interface IAuthData {
	sid: number,
	token: string,
	userId: string,
	type: AuthType,
	oauthToken: string
}

export interface IAuthInitialData {
	sid: number | null,
	token: string | null,
	userId: string | null,
	type: AuthType | null,
	oauthToken: string | null
}