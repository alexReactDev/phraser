import { IUserInput } from "../types/users";

import db from "../model/db";
import settingsController from "./Settings";
import globalErrorHandler from "../misc/globalErrorHandler";
import profilesController from "./Profiles";
import { IContext } from "@ts-backend/context";
import bcrypt from "bcrypt";
import { User } from "../Classes/User";
import logAccountSecurityEvent from "../misc/logAccountSecurityEven";

class UsersController {
	async getUser({ id }: { id: string }) {
		let user;

		try {
			const res = await db.collection("users").findOne({ id });

			if(!res) throw new Error("Status 404. User not found");

			const { password, ...userData } = res;
			user = userData;
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Cannot get user. ${e.toString()}`);
		}

		return user;
	}

	async createUser({ input, type = "default" }: { input: IUserInput, type?: "default" | "oauth" }) {
		const user = await db.collection("users").findOne({
			email: input.email
		})

		if(user) throw new Error("400. Bad request. Email already in use");

		let createdUser;
		
		if(type === "default") {
			if(!input.password) throw new Error("400. Bad request. Password is required for default auth type");
			const hash = await bcrypt.hash(input.password, 3);
			createdUser = new User({
				email: input.email,
				password: hash
			}, "default");
		} else {
			createdUser = new User({
				email: input.email,
			}, "oauth");
		}

		try {
			await db.collection("users").insertOne(createdUser);
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to create user. ${e.toString()}`);
		}

		try {
			await settingsController.createSettings({ id: createdUser.id });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to create user settings. ${e.toString()}`);
		}

		const profileId = await profilesController.createProfile({ input: { name: "Default", userId: createdUser.id } });
		await settingsController.updateUserSettings({ id: createdUser.id, input: { activeProfile: profileId } });

		return createdUser.id;
	}

	async deleteUser({ id, password }: { id: string, password: string }, context: IContext) {
		let user;

		try {
			user = await db.collection("users").findOne({ id });
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete user - failed to verify password ${e}`)
		}

		if(!bcrypt.compareSync(password, user.password)) throw new Error("403. Access denied - wrong password");

		try {
			const promises = [];

			promises.push(db.collection("users").deleteOne({ id: id }));
			promises.push(db.collection("settings").deleteOne({ userId: id }));
			promises.push(db.collection("profiles").deleteMany({ userId: id }));
			promises.push(db.collection("collections").deleteMany({ userId: id }));
			promises.push(db.collection("phrases").deleteMany({ userId: id }));
			promises.push(db.collection("repetitions").deleteMany({ userId: id }));
			promises.push(db.collection("premium").deleteOne({ userId: id }));
			promises.push(db.collection("active_sessions").deleteMany({ userId: id }));

			await Promise.all(promises);
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete user. ${e}`);
		}

		const ip = context.req.headers["x-real-ip"] || context.req.ip || "unknown";

		logAccountSecurityEvent({
			date: new Date().toString(),
			type: "Account deleted",
			ip: ip as string,
			user: id
		});

		return "OK";
	}
}

export default new UsersController();