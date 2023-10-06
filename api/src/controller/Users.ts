import { IUserInput } from "../types/users";

const db = require("../model/db.ts");
const settingsController = require("./Settings.ts");

class UsersController {
	async createUser({ input }: { input: IUserInput}) {
		const id = generateId();

		try {
			await db.collection("users").insertOne({
				id,
				name: input.name,
				login: input.login,
				password: input.password
			})
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		try {
			await settingsController.createSettings({ id });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		return "OK"
	}

	async deleteUser({ id }: { id: string | number}) {
		try {
			await db.collection("users").deleteOne({ id: +id });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return "OK";
	}
}

module.exports = new UsersController();