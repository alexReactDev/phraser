import { ISettingsInput } from "../types/settings";

const db = require("../model/db.ts");

class SettingsController {
	async createSettings({ id }: { id: string | number }) {
		try {
			await db.collection("settings").insertOne({
				id: generateId(),
				userId: +id,
				settings: {
					theme: "default",
					phrasesOrder: "default",
					repetitionsAmount: 1
				}
			});
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return "OK";
	}

	async updateSettings({ id, input }: { id: string | number, input: ISettingsInput }) {
		try {
			await db.collection("settings").updateOne({ userId: +id }, {
				settings: input
			});
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return "OK";
	}

	async deleteSettings({ id }: { id: string | number }) {
		try {
			await db.collection("settings").deleteOne({ userId: +id });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return "OK";
	}
}

module.exports = new SettingsController();