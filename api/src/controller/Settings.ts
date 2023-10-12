import { ISettingsInput } from "../types/settings";

const db = require("../model/db.ts");
const generateId = require("../utils/generateId");

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

	async getUserSettings({ id }: { id: string | number}) {
		let settings;

		try {
			settings = await db.collection("settings").findOne({
				userId: +id
			})
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return settings;
	}

	async setUserSettings({ id, input }: { id: string | number, input: ISettingsInput }) {
		try {
			await db.collection("settings").updateOne({ userId: +id }, {
				$set: {
					settings: input
				}
			});
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return "OK";
	}

	async updateUserSettings({ id, input }:  { id: string | number, input: Partial<ISettingsInput>}) {
		let settings;
		
		try {
			settings = await this.getUserSettings({ id });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		for(let key in input) {
			//@ts-ignore
			settings.settings[key] = input[key];
		}

		try {
			await db.collection("settings").updateOne({ userId: +id }, {
				$set: {
					settings: settings.settings
				}
			});
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return settings;
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