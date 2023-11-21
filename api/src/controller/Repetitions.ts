import { IRepetitionInput } from "@ts/repetitions";

const db = require("../model/db");
const generateId = require("../utils/generateId");
const globalErrorHandler = require("../service/globalErrorHandler");

class RepetitionsController {
	async createRepetition({ repetition }: { repetition: IRepetitionInput }) {
		try {
			const id = generateId();

			await db.collection("repetitions").insertOne({
				id,
				...repetition
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

module.exports = new RepetitionsController();