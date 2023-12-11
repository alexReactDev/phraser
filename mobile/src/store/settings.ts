import { makeAutoObservable } from "mobx";
import { ISettings, IUserSettings } from "@ts/settings";

class Settings {
	loading = false;
	loaded = false;
	error = null;
	settings: Partial<ISettings> = {};

	constructor() {
		makeAutoObservable(this);
	}

	loadingStart() {
		this.loading = true;
		this.error = null;
	}

	settingsLoaded(settings: IUserSettings) {
		this.loading = false;
		this.loaded = true;
		this.settings = settings.settings;
	}

	loadError(error: any) {
		this.loading = false;
		this.error = error;
	}
}

export default new Settings();