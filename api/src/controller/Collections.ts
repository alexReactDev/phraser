const db = require("../model/db.ts");

class CollectionsController {
	async getCollection({ id }: any) {
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

	async getCollectionsAll() {
		let result;

		try {
			let cursor = await db.collection("collections").find({});
			result = await cursor.toArray();
		}
		catch(e: any) {
			console.log(e)
			return `Error ${e}`;
		}

		return result;
	}

	async getCollectionByPhrase() {

	}

	async createCollection() {

	}

	async mutateCollection() {

	}

	async deleteCollection() {

	}
}

module.exports = new CollectionsController();