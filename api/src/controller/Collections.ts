import { IChangeCollectionLockInput, ICollectionInput } from "../types/collections";

const db = require("../model/db.ts");
const generateId = require("../utils/generateId");
const globalErrorHandler = require("../service/globalErrorHandler");

class CollectionsController {
	async getCollection({ id }: { id: string }) {
		let result;

		try {
			result = await db.collection("collections").findOne({ id });

			if(!result) throw new Error("404. Collection not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw `Server error. Failed to get collection. ${e}`;
		}

		return result;
	}

	async getCollectionsByProfile({ id }: { id: string }) {
		let result;
		
		try {
			let cursor = await db.collection("collections").find({
				profile: id
			});

			result = await cursor.toArray();
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw `Server error. Failed to get collection. ${e}`;
		}

		return result;
	}

	async getCollectionByPhrase({ id }: { id: string }) {
		let result;

		try {
			result = await db.collection("collections").findOne({
				phrases: { $in: [id] }
			});

			if(!result) throw new Error("404. Collection not found");
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to find collection. ${e}`;
		}

		return result;
	}

	async createCollection({ input }: {input: ICollectionInput}) {
		try {
			await db.collection("collections").insertOne({
				...input,
				id: generateId(),
				isLocked: false,
				created: new Date().getTime(),
				lastUpdate: new Date().getTime(),
				profile: input.profile,
				meta: {
					phrasesCount: 0,
					repetitionsCount: 0,
					lastRepetition: null
				},
				phrases: [],
				repetitions: []
			})
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to create collection. ${e}`;
		}

		return "OK";
	}

	async mutateCollection({ id, input }: { id: string, input: ICollectionInput}) {
		try {
			await db.collection("collections").updateOne({ id }, {
				$set: {
					name: input.name,
					color: input.color
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to mutate collection. ${e}`;
		}

		return "OK";
	}

	async changeCollectionLock({ id, input }: { id: string, input: IChangeCollectionLockInput}) {
		try {
			await db.collection("collections").updateOne({ id }, {
				$set: {
					isLocked: input.isLocked
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to lock/unlock collection. ${e}`;
		}

		return "OK";
	}

	async deleteCollection({ id }: { id: string }) {
		try {
			await db.collection("collections").deleteOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to delete collection. ${e}`;
		}

		return "OK";
	}
}

module.exports = new CollectionsController();