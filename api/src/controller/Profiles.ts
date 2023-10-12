import { IProfileInput } from "../types/profiles";

const db = require("../model/db.ts");
const generateId = require("../utils/generateId.ts");

class ProfilesController {
	async createProfile({ input }: { input: IProfileInput }) {
		try {
			await db.collection("profiles").insertOne({
				id: generateId(),
				name: input.name,
				userId: +input.userId
			})
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		return "OK";
	}

	async getUserProfiles({ id }: { id: string | number }) {
		let result;

		try {
			const cursor = await db.collection("profiles").find({
				userId: +id
			})

			result = await cursor.toArray();
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		return result;
	}

	async mutateProfile({ id, input }: { id: string | number, input: { name: string }}) {
		try {
			await db.collection("profiles").updateOne({ id: +id }, {
				$set: {
					name: input.name
				}
			})
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		return "OK";
	}

	async deleteProfile({ id }: { id: string | number}) {
		try {
			await db.collection("profiles").deleteOne({ id: +id});
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server Error: ${e.toString()}`);
		}

		return "OK";
	}
}

module.exports = new ProfilesController();