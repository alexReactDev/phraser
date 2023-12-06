import { IUserInput } from "../types/users";

import db from "../model/db";
import settingsController from "./Settings";
import generateId from "../misc/generateId";
import globalErrorHandler from "../misc/globalErrorHandler";
import profilesController from "./Profiles";

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

	async createUser({ input }: { input: IUserInput}) {
		const user = await db.collection("users").findOne({
			login: input.login
		})

		if(user) throw new Error("400. Bad request. Login already taken");

		const id = generateId();

		try {
			await db.collection("users").insertOne({
				id,
				name: input.name,
				login: input.login,
				password: input.password,
				created: new Date().getTime()
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to create user. ${e.toString()}`);
		}

		try {
			await settingsController.createSettings({ id });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to create user settings. ${e.toString()}`);
		}

		const profileId = await profilesController.createProfile({ input: { name: "Default", userId: id } });
		await settingsController.updateUserSettings({ id, input: { activeProfile: profileId} });

		return id;
	}

	async deleteUser({ id }: { id: string }) {
		try {
			await db.collection("users").deleteOne({ id: id });
			await db.collection("settings").deleteOne({ userId: id });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete user. ${e}`);
		}

		return "OK";
	}
}

export default new UsersController();