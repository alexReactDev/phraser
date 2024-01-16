import { IUser } from "@ts-backend/users";
import { v4 } from "uuid";

export class User implements IUser {
	id: string;
	email: string;
	password: string;
	isVerified: boolean;
	created: number;

	constructor(email: string, password: string) {
		this.id = v4();
		this.email = email;
		this.password = password;
		this.isVerified = false;
		this.created = new Date().getTime()
	}
}