import { IJWT } from "../types/authorization";
import { IPhrase } from "@ts/phrases";
import { IPhraseInput, IPhraseRepetitionInput } from "../types/phrases";

const db = require("../model/db.ts");
const generateId = require("../utils/generateId");
const globalErrorHandler = require("../service/globalErrorHandler");
const settingsController = require("./Settings");

class PhrasesController {
	async getPhrase({ id }: { id: string }) {
		let phrase;

		try {
			phrase = await db.collection("phrases").findOne({ id });

			if(!phrase) throw new Error("404. Phrase not found");
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to get collection ${e}`;
		}

		return phrase;
	}

	async getPhrasesByCollection({ id }: { id: string }) {
		let phrases;

		try {
			const collection = await db.collection("collections").findOne({ id });

			if(!collection) throw new Error("404. Collection not found");

			const cursor = await db.collection("phrases").find({ id: { $in: collection.phrases }});

			phrases = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Can't get phrases. ${e}`;
		}

		return phrases;
	}

	async createPhrase({ input, collection }: { input: IPhraseInput, collection: string }, context: { auth: IJWT }) {
		const timestamp = new Date().getTime();
		const id = generateId();

		console.log(context);

 		const userSettings = await settingsController.getUserSettings({ id: context.auth.userId });

		console.log(userSettings);

		const phrase = {
			...input,
			id,
			created: timestamp,
			lastUpdate: timestamp,
			meta: {
				repeated: 0,
				guessed: 0,
				forgotten: 0
			},
			profile: userSettings.settings.activeProfile
		}

		try {
			await db.collection("phrases").insertOne(phrase);
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to create phrase. ${e}`;
		}

		try {
			const col = await db.collection("collections").findOne({ id: collection });

			if(!col) throw new Error("404. Collection not found");

			if(col.isLocked) throw new Error("400. Collection is locked");

			await db.collection("collections").updateOne({ id: collection }, {
				$set: {
					phrases: [...col.phrases, id],
					meta: {
						...col.meta,
						phrasesCount: col.meta.phrasesCount + 1
					}
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Sever error. Failed to create phrase: failed to add phrase to collection. ${e}`);
		}

		return phrase;
	}

	async mutatePhrase({ id, input, collection }: { id: string, input: IPhraseInput, collection: string}) {
		try {
			await db.collection("phrases").updateOne({ id }, {
				$set: {
					value: input.value,
					translation: input.translation
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to mutate phrase. ${e}`;
		}

		try {
			const oldCollection = await db.collection("collections").findOne({
				phrases: {
					$in: [id]
				}
			})

			if(!oldCollection) throw new Error("404. Collection not found");

			if(collection && (oldCollection.id !== collection)) {
				const newCollection = await db.collection("collections").findOne({ id: collection });

				if(!newCollection) throw new Error("404. Collection not found");

				if(newCollection.isLocked) throw new Error("400. Collection is locked");

				await db.collection("collections").updateOne({ id: oldCollection.id }, {
					$set: {
						phrases: oldCollection.phrases.filter((phrase: string) => phrase !== id)
					}
				})

				await db.collection("collections").updateOne({ id: collection }, {
					$set: {
						phrases: [ ...newCollection.phrases, id ]
					}
				})
			}
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to mutate phrase: failed to change collection. ${e}`;
		}

		return "OK";
	}

	async mutatePhraseMeta({ input }: { input: [IPhraseRepetitionInput] }) {
		return "OK";
	}	

	async deletePhrase({ id }: { id: string }) {
		try {
			await db.collection("phrases").deleteOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw `Server error. Failed to delete phrase. ${e}`;
		}

		return "OK";
	}
}

module.exports = new PhrasesController();