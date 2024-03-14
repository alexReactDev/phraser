import { IUser } from "@ts-backend/users";
import { v4 } from "uuid";

export class User implements IUser {
	id: string;
	email: string;
	password: IUser["password"];
	isVerified: boolean;
	created: number;

	constructor({ email, password }: { email: string, password?: string }, type: "default" | "oauth") {
		this.id = v4();
		this.email = email;
		this.created = new Date().getTime();

		if(type === "oauth") {
			this.password = null;
			this.isVerified = true;
		} else {
			if(!password) throw new Error("Password is required in default auth type");
			this.password = password;
			this.isVerified = false;
		}
	}
}