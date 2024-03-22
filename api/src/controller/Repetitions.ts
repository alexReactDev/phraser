import { IRepetitionInput } from "@ts/repetitions";

import db from "../model/db";
import generateId from "../misc/generateId";
import globalErrorHandler from "../misc/globalErrorHandler";

class RepetitionsController {
	async getProfileRepetitions({ profileId }: { profileId: string }) {
		let repetitions;

		try {
			const cursor = await db.collection("repetitions").find({
				profileId
			});

			repetitions = await cursor.sort({ created: -1 }).toArray();
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get repetitions ${e}`)
		}

		return repetitions;
	}

	async createRepetition({ input }: { input: IRepetitionInput }) {
		try {
			const id = generateId();

			await db.collection("repetitions").insertOne({
				id,
				...input
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Error! Failed to create repetition.\n${e}`);
		}

		return "OK"
	}
}

export default new RepetitionsController();