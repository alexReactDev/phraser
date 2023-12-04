import { makeAutoObservable } from "mobx";

class LoadingSpinner {
	displaySpinner = false;
	loadingsCount = 0;

	constructor() {
		makeAutoObservable(this);
	}

	setLoading() {
		this.displaySpinner = true;
		++this.loadingsCount;
	}

	dismissLoading() {
		--this.loadingsCount;
		if(this.loadingsCount === 0) this.displaySpinner = false;
	}
}

export default new LoadingSpinner();