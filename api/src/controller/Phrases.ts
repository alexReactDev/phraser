import { IPhraseInput, IPhraseRepetitionInput } from "../types/phrases";

import db from "../model/db";
import generateId from "../misc/generateId";
import globalErrorHandler from "../misc/globalErrorHandler";
import settingsController from "./Settings";
import { IContext } from "@ts-backend/context";

class PhrasesController {
	async getPhrase({ id }: { id: string }) {
		let phrase;

		try {
			phrase = await db.collection("phrases").findOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get phrase ${e}`);
		}

		if(!phrase) throw new Error("404. Phrase not found");

		return phrase;
	}

	async getPhrasesByCollection({ id }: { id: string }) {
		let phrases;

		try {
			const collection = await db.collection("collections").findOne({ id });

			if(!collection) throw new Error("404. Collection not found");

			const cursor = await db.collection("phrases").find({ id: { $in: collection.phrases }});

			phrases = await cursor.sort({ created: -1 }).toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get phrases. ${e}`);
		}

		return phrases;
	}

	async createPhrase({ input, collection }: { input: IPhraseInput, collection: string }, context: IContext) {
		const timestamp = new Date().getTime();
		const id = generateId();

 		const userSettings = await settingsController.getUserSettings({ id: context.auth.userId });

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
			profile: userSettings.settings.activeProfile,
			userId: context.auth.userId
		}

		try {
			await db.collection("phrases").insertOne(phrase);
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create phrase. ${e}`);
		}

		await this.addToCollection({ id, destId: collection });

		return phrase;
	}

	async mutatePhrase({ id, input }: { id: string, input: IPhraseInput }) {
		try {
			await db.collection("phrases").updateOne({ id }, {
				$set: {
					value: input.value,
					translation: input.translation
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to mutate phrase. ${e}`);
		}

		return "OK";
	}

	async movePhrase({ id, destId }: { id: string, destId: string }) {
		await this.removeFromCollection({ id });

		await this.addToCollection({ id, destId });

		return "OK"
	}

	async moveMany({ ids, destId }: { ids: string[], destId: string}) {
		await this.removeFromCollectionMany({ ids });

		let dest;

		try {
			dest = await db.collection("collections").findOne({ id: destId });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to move phrases: Failed to get destination collection ${e}`);
		}

		if(!dest) throw new Error("404. Destination collection not found");

		if(dest.isLocked) throw new Error("400. Destination collection is locked");

		try {
			await db.collection("collections").updateOne({ id: destId }, {
				$set: {
					phrases: [ ...dest.phrases, ...ids ],
					meta: {
						...dest.meta,
						phrasesCount: dest.meta.phrasesCount + ids.length
					}
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to move phrases: Failed to update destination collection ${e}`);
		}

		return "OK"
	}

	async mutatePhraseMeta({ id, input }: { id: string, input: IPhraseRepetitionInput }) {
		let phrase;

		try {
			phrase = await db.collection("phrases").findOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get phrase. ${e}`);
		}

		if(!phrase) throw new Error("404. Collection not found");

		try {
			await db.collection("phrases").updateOne({ id }, {
				$set: {
					"meta.guessed": phrase.meta.guessed + input.guessed,
					"meta.forgotten": phrase.meta.forgotten + input.forgotten,
					"meta.lastRepetition": input.lastRepetition
				}
			});
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to edit phrase meta. ${e}`);
		}

		return "OK";
	}	

	async deletePhrase({ id }: { id: string }) {
		await this.removeFromCollection({ id });

		try {
			await db.collection("phrases").deleteOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete phrase. ${e}`);
		}

		return "OK";
	}

	async deleteMany({ ids }: { ids: string[] }) {
		await this.removeFromCollectionMany({ ids });

		try {
			await db.collection("phrases").deleteMany({ id: { $in: ids } });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete phrases. ${e}`);
		}

		return "OK";
	}

	async addToCollection({ id, destId }: { id: string, destId: string }) {
		let dest;

		try {
			dest = await db.collection("collections").findOne({ id: destId });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to add to collection: Failed to get destination collection ${e}`);
		}

		if(!dest) throw new Error("404. Destination collection not found");

		if(dest.isLocked) throw new Error("400. Destination collection is locked");

		try {
			await db.collection("collections").updateOne({ id: destId }, {
				$set: {
					phrases: [ ...dest.phrases, id ],
					meta: {
						...dest.meta,
						phrasesCount: dest.meta.phrasesCount + 1
					}
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to add to collection. Failed to update destination collection ${e}`);
		}

		return "OK"
	}

	async removeFromCollection({ id }: { id: string }) {
		let collection;

		try {
			collection = await db.collection("collections").findOne({
				phrases: {
					$in: [id]
				}
			})
		}
		catch(e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed remove phrase from collection: Failed to get collection. ${e}`);
		}

		if(!collection) throw new Error("404. Failed to remove phrase from collection: Collection not found");

		try {
			await db.collection("collections").updateOne({ id: collection.id }, {
				$set: {
					phrases: collection.phrases.filter((phrase: string) => phrase !== id),
					meta: {
						...collection.meta,
						phrasesCount: collection.meta.phrasesCount - 1
					}
				}
			})
		}
		catch(e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed remove phrase from collection. ${e}`);
		}

		return "OK"
	}

	async removeFromCollectionMany({ ids }: { ids: string[] }) {
		let collection;

		try {
			collection = await db.collection("collections").findOne({
				phrases: {
					$in: ids
				}
			})
		}
		catch(e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed remove phrases from collection: Failed to get collection. ${e}`);
		}

		if(!collection) throw new Error("404. Failed to remove phrases from collection: Collection not found");

		try {
			await db.collection("collections").updateOne({ id: collection.id }, {
				$set: {
					phrases: collection.phrases.filter((phrase: string) => !ids.includes(phrase)),
					meta: {
						...collection.meta,
						phrasesCount: collection.meta.phrasesCount - ids.length
					}
				}
			})
		}
		catch(e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed remove phrases from collection. ${e}`);
		}

		return "OK"
	}
}

export default new PhrasesController();