import { IRepetitionInput } from "@ts/repetitions";

import db from "../model/db";
import generateId from "../utils/generateId";
import globalErrorHandler from "../service/globalErrorHandler";

class RepetitionsController {
	async createRepetition({ input }: { input: IRepetitionInput }) {
		try {
			const id = generateId();

			await db.collection("repetitions").insertOne({
				id,
				...input
			})
		} catch (e) {
			globalErrorHandler(e);
			return `Error! Failed to create repetition.\n${e}`;
		}

		return "OK"
	}

	async getUserRepetitions({ userId }: { userId: string | number }) {
		let repetitions;

		try {
			const cursor = await db.collection("repetitions").find({
				userId
			})

			repetitions = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			return `Error! Failed to create repetition.\n${e}`;
		}

		return repetitions;
	}
}

export default new RepetitionsController();