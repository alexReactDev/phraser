import { makeAutoObservable } from "mobx";
import { IAuthData, IAuthInitialData } from "../types/authorization";
import { removeAuthToken } from "../utils/authToken";

class Session {
	loading = false;
	loaded = false;
	error: any = null;
	data: IAuthInitialData = {
		token: null,
		sid: null,
		userId: null
	}

	constructor() {
		makeAutoObservable(this);
	}

	loadingStart() {
		this.loading = true;
	}

	tokenLoaded(token: string) {
		this.data.token = token;

		if(!token) {
			this.loading = false;
			this.loaded = true;
		}
	}

	dataLoaded(data: Partial<IAuthData>) {
		this.data = {
			...this.data,
			...data
		}
		this.loaded = true;
		this.loading = false;
	}

	async sessionError(error: any) {
		if(error.networkError.statusCode === 401) {
			await removeAuthToken();
			this.data.token = null;
			this.loading = false;
			this.loaded = true;
		} else {
			this.error = error;
			this.loading = false;
		}
	}
}

export default new Session();