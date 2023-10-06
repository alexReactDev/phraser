import { IChangeCollectionLockInput, ICollectionInput } from "../types/collections";

const db = require("../model/db.ts");

class CollectionsController {
	async getCollection({ id }: { id: string | number }) {
		let result;

		try {
			result = await db.collection("collections").findOne({ id: +id });
		}
		catch(e: any) {
			console.log(e)
			return `Error ${e}`;
		}

		return result;
	}

	async getCollectionsByProfile({ id }: { id: string | number }) {
		let result;

		try {
			let cursor = await db.collection("collections").find({
				id: +id
			});
			result = await cursor.toArray();
		}
		catch(e: any) {
			console.log(e)
			return `Error ${e}`;
		}

		return result;
	}

	async getCollectionByPhrase({ id }: { id: string | number }) {
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
				id: new Date().getTime(),
				isLocked: false,
				created: new Date().getTime(),
				lastUpdate: new Date().getTime(),
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

	async mutateCollection({ id, input }: { id: string | number, input: ICollectionInput}) {
		try {
			await db.collection("collections").updateOne({ id: +id }, {
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

	async changeCollectionLock({ id, input }: { id: string | number, input: IChangeCollectionLockInput}) {
		try {
			await db.collection("collections").updateOne({ id: +id }, {
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

	async deleteCollection({ id }: { id: string | number }) {
		try {
			let res = await db.collection("collections").deleteOne({ id: +id });
			console.log(res);
		} catch (e) {
			console.log(e);
			return `Error ${e}`;
		}

		return "OK";
	}
}

module.exports = new CollectionsController();