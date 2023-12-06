import { ISettings, IUserSettings } from "@ts/settings";

import db from "../model/db";
import generateId from "../utils/generateId";
import globalErrorHandler from "../service/globalErrorHandler";

class SettingsController {
	async createSettings({ id }: { id: string }) {
		const settings: IUserSettings = {
			id: generateId(),
			userId: id,
			settings: {
				theme: "default",
				phrasesOrder: "default",
				repetitionsAmount: 1,
				activeProfile: "",
				disableAutoCollections: false,
				autoCollectionsSize: 30,
				intervalRepetitionDates: "auto",
				useGPT3: false,
				textDifficulty: "default"
			}
		}

		try {
			await db.collection("settings").insertOne(settings);
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create settings. ${e}`);
		}

		return settings;
	}

	async getUserSettings({ id }: { id: string }) {
		let settings;

		try {
			settings = await db.collection("settings").findOne({
				userId: id
			})

			if(!settings) throw new Error("404. User settings not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get settings. ${e}`);
		}

		return settings;
	}

	async setUserSettings({ id, input }: { id: string, input: ISettings}) {
		try {
			await db.collection("settings").updateOne({ userId: id }, {
				$set: {
					settings: input
				}
			});
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to set user settings. ${e}`);
		}

		return "OK";
	}

	async updateUserSettings({ id, input }:  { id: string, input: Partial<ISettings>}) {
		let settings;
		
		settings = await this.getUserSettings({ id });


		for(let key in input) {
			//@ts-ignore
			settings.settings[key] = input[key];
		}

		try {
			await db.collection("settings").updateOne({ userId: id }, {
				$set: {
					settings: settings.settings
				}
			});
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update user settings. ${e}`);
		}

		return settings;
	}

	async deleteSettings({ id }: { id: string }) {
		try {
			await db.collection("settings").deleteOne({ userId: id });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete settings. ${e}`);
		}

		return "OK";
	}
}

export default new SettingsController();