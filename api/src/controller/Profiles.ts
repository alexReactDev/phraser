import { IProfileInput } from "../types/profiles";

const db = require("../model/db.ts");
const generateId = require("../utils/generateId.ts");
const globalErrorHandler = require("../service/globalErrorHandler");

class ProfilesController {
	async createProfile({ input }: { input: IProfileInput }) {
		try {
			await db.collection("profiles").insertOne({
				id: generateId(),
				name: input.name,
				userId: input.userId
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to create profile. ${e.toString()}`);
		}

		return "OK";
	}

	async getUserProfiles({ id }: { id: string }) {
		let result;

		try {
			const cursor = await db.collection("profiles").find({
				userId: id
			})

			result = await cursor.toArray();
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to get profiles. ${e.toString()}`);
		}

		return result;
	}

	async mutateProfile({ id, input }: { id: string, input: { name: string }}) {
		try {
			await db.collection("profiles").updateOne({ id }, {
				$set: {
					name: input.name
				}
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to mutate profile. ${e.toString()}`);
		}

		return "OK";
	}

	async deleteProfile({ id }: { id: string }) {
		try {
			await db.collection("profiles").deleteOne({ id });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server Error. Failed to delete profile. ${e.toString()}`);
		}

		return "OK";
	}
}

module.exports = new ProfilesController();