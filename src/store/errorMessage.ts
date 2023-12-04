import { makeAutoObservable } from "mobx";

class ErrorMessage {
	displayMessage = false;
	message = "";

	constructor() {
		makeAutoObservable(this);
	}

	setErrorMessage(message: string) {
		this.displayMessage = true;
		this.message = message;
	}

	dismissErrorMessage() {
		this.displayMessage = false;
		this.message = "";
	}
}

export default new ErrorMessage();