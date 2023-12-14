import { ILoginInput, ISignUpInput } from "../types/authorization";
import { signJWT } from "../misc/signJWT";

import db from "../model/db";
import usersController from "./Users";
import globalErrorHandler from "../misc/globalErrorHandler";
import { IContext } from "@ts-backend/context";

class AuthorizationController {
	async login({ input }: { input: ILoginInput }) {
		let user;

		try {
			user = await db.collection("users").findOne({ login: input.login });

			if(!user) throw new Error("404. User not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to log in. ${e}`);
		}

		if(input.password !== user.password) throw new Error(`403. Access denied`);

		const token = await signJWT({ login: user.login, userId: user.id });

		return {...token};
	}

	async logout({}, context: IContext) {
		try {
			await db.collection("active_sessions").deleteOne({
				sid: context.auth.sid
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to log out ${e}`);
		}

		return "OK";
	}

	async signUp({ input }: { input: ISignUpInput }) {
		let userId;
		
		try {
			userId = await usersController.createUser({ input });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create user. ${e}`);
		}

		const token = await signJWT({ login: input.login, userId });

		return {...token};
	}

	async getSession({}, context: IContext) {
		if(context?.auth?.sid) return { sid: context.auth.sid, userId: context.auth.userId };

		return "";
	}
}

export default new AuthorizationController();