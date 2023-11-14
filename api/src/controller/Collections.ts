import { IChangeCollectionLockInput, ICollectionInput } from "../types/collections";

const db = require("../model/db.ts");
const generateId = require("../utils/generateId");

class CollectionsController {
	async getCollection({ id }: { id: string }) {
		let result;

		try {
			result = await db.collection("collections").findOne({ id });
		}
		catch(e: any) {
			console.log(e)
			return `Error ${e}`;
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
			console.log(e)
			return `Error ${e}`;
		}

		return result;
	}

	async getCollectionByPhrase({ id }: { id: string }) {
		let result;

		try {
			result = await db.collection("collections").findOne({
				phrases: { $in: [id] }
			})
		} catch (e) {
			console.log(e);
			return `Error ${e}`;
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
					repetitionsCount: 0
				},
				phrases: [],
				repetitions: []
			})
		} catch (e) {
			console.log(e);
			return `Error ${e}`;
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
			console.log(e);
			return `Error ${e}`;
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
			console.log(e);
			return `Error ${e}`;
		}

		return "OK";
	}

	async deleteCollection({ id }: { id: string }) {
		try {
			let res = await db.collection("collections").deleteOne({ id });
			console.log(res);
		} catch (e) {
			console.log(e);
			return `Error ${e}`;
		}

		return "OK";
	}
}

module.exports = new CollectionsController();