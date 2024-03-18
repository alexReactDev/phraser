import { makeAutoObservable } from "mobx";

class ErrorMessage {
	displayMessage = false;
	message = "";
	type = "";

	constructor() {
		makeAutoObservable(this);
	}

	setErrorMessage(message: string) {
		this.displayMessage = true;
		this.message = message;
		this.type = "error";
	}

	setInfoMessage(message: string) {
		this.displayMessage = true;
		this.message = message;
		this.type = "info";
	}

	dismissErrorMessage() {
		this.displayMessage = false;
		this.message = "";
	}
}

export default new ErrorMessage();