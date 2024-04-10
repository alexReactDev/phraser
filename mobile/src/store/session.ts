import { makeAutoObservable } from "mobx";
import { IAuthData, IAuthInitialData } from "../types/authorization";
import { removeAuthToken } from "../utils/authToken";
import { AuthType } from "@ts/authorization";

const initialData = {
	token: null,
	sid: null,
	userId: null,
	type: null,
	oauthToken: null
};
class Session {
	loading = false;
	loaded = false;
	error: any = null;
	data: IAuthInitialData = initialData;

	constructor() {
		makeAutoObservable(this);
	}

	loadingStart() {
		this.loading = true;
	}

	tokenLoaded(data: { token: string, type: AuthType, oauthToken?: string } | null) {
		if(!data) {
			this.loading = false;
			this.loaded = true;
			return;
		}

		this.data.token = data.token;
		this.data.type = data.type;
		this.data.oauthToken = data.oauthToken || null;
	}

	updateOauthToken(oauthToken: string) {
		this.data.oauthToken = oauthToken;
	}

	dataLoaded(data: Partial<IAuthData>) {
		this.data = {
			...this.data,
			...data
		}
		this.loaded = true;
		this.loading = false;
	}

	async logout() {
		this.loading = false;
		this.error = null;
		this.loaded = true;
		this.data = initialData;
		await removeAuthToken();
	}

	async sessionError(error: any) {
		if(error.networkError.statusCode === 401) {
			await removeAuthToken();
			this.data = initialData;
			this.loading = false;
			this.loaded = true;
		} else {
			this.error = error;
			this.loading = false;
		}
	}
}

export default new Session();