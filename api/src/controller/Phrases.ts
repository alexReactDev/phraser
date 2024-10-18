import { IMutatePhraseInput, IPhraseInput, IPhraseRepetitionInput } from "../types/phrases";

import db from "../model/db";
import generateId from "../misc/generateId";
import globalErrorHandler from "../misc/globalErrorHandler";
import settingsController from "./Settings";
import { IContext } from "@ts-backend/context";
import collectionsController from "./Collections";
import { IAutoCollection } from "@ts/collections";
import StatsItem from "../Classes/StatsItem";
import CustomDate from "../Classes/CustomDate";
import { IPhrase } from "@ts/phrases";

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

	async getPhraseOfTheDay({ userId }: { userId: string }) {
		let phrases;

		try {
			const cursor = await db.collection("phrases").find({ userId });
			phrases = await cursor.toArray();
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error("Server error. Failed to get phrases");
		}

		interface IPhraseWithScore {
			phrase: IPhrase,
			score: number
		}

		const phrasesWithScore = phrases.map((phrase: IPhrase) => ({
			phrase,
			score: phrase.meta.forgotten - phrase.meta.guessed
		}));

		const selectedPhrases = phrasesWithScore.concat().sort((a: IPhraseWithScore, b: IPhraseWithScore) => b.score - a.score).slice(0, 20);
		const index = Math.trunc(Math.random() * selectedPhrases.length);

		return selectedPhrases[index].phrase;
	}

	async getPhrasesByCollection({ id }: { id: string }) {
		const collection = await collectionsController.getCollection({ id }) as IAutoCollection;

		let phrases;

		if(collection.isAutoGenerated) {
			try {
				const cursor = await db.collection("phrases").find({
					id: { $in: collection.phrases }
				});
				phrases = await cursor.sort({ created: -1 }).toArray();
			} catch (e) {
				globalErrorHandler(e);
				throw new Error(`Server error. Failed to get collection phrases. ${e}`);
			}
		} else {
			try {
				const cursor = await db.collection("phrases").find({ collection: id });
				phrases = await cursor.sort({ created: -1 }).toArray();
			} catch (e) {
				globalErrorHandler(e);
				throw new Error(`Server error. Failed to get collection phrases. ${e}`);
			}
		}

		return phrases;
	}

	async getProfilePhrasesCount({ profileId }: { profileId: string }) {
		const collections = await collectionsController.getCollectionsByProfile({ id: profileId });
		let count = 0;

		for(let col of collections) {
			try {
				const cursor = await db.collection("phrases").find({
					collection: col.id
				});

				count += await cursor.count();
			} catch (e) {
				globalErrorHandler(e);
				throw new Error(`Server error. Failed to get phrases ${e}`);
			}
		}

		return count;
	}

	async createPhrase({ input, collection }: { input: IPhraseInput, collection: string }, context: IContext) {
		const col = await collectionsController.getCollection({ id: collection });

		if(col.isLocked) throw new Error("400. Bad request - collection is locked");

		const id = generateId();
		const timestamp = new Date().getTime();

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
			collection,
			profile: userSettings.settings.activeProfile,
			userId: context.auth.userId
		}

		try {
			await db.collection("phrases").insertOne(phrase);
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create phrase. ${e}`);
		}

		try {
			await db.collection("collections").updateOne({ id: collection }, {
				$set: {
					"meta.phrasesCount": col.meta.phrasesCount + 1,
					lastUpdate: timestamp
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update collection. ${e}`);
		}

		await this._updateStats(col.profile, input.day);

		return phrase;
	}

	async mutatePhrase({ id, input }: { id: string, input: IMutatePhraseInput }) {
		let updatedPhrase;

		try {
			await db.collection("phrases").updateOne({ id }, {
				$set: {
					value: input.value,
					translation: input.translation,
					lastUpdate: new Date().getTime()
				}
			});

			updatedPhrase = await db.collection("phrases").findOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to mutate phrase. ${e}`);
		}

		return updatedPhrase;
	}

	async movePhrase({ id, destId }: { id: string, destId: string }) {
		const dest = await collectionsController.getCollection({ id: destId });
		
		if(dest.isLocked) throw new Error("400. Bad request - collection is locked");
		
		const col = await db.collection("collections").findOne({
			id: (await db.collection("phrases").findOne({ id })).collection
		});

		let updatedPhrase;

		try {
			await db.collection("phrases").updateOne({ id }, {
				$set: {
					collection: destId
				}
			});
			updatedPhrase = await db.collection("phrases").findOne({ id });
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to move phrase ${e}`);
		}

		try {
			await db.collection("collections").updateOne({ id: destId }, {
				$set: {
					"meta.phrasesCount": dest.meta.phrasesCount + 1,
					lastUpdate: new Date().getTime()
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update collection. ${e}`);
		}

		try {
			await db.collection("collections").updateOne({ id: col.id }, {
				$set: {
					"meta.phrasesCount": col.meta.phrasesCount - 1,
					lastUpdate: new Date().getTime()
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update collection. ${e}`);
		}

		return updatedPhrase;
	}

	async moveMany({ ids, destId }: { ids: string[], destId: string}) {
		const dest = await collectionsController.getCollection({ id: destId });

		if(dest.isLocked) throw new Error("400. Bad request - collection is locked");

		const col = await db.collection("collections").findOne({
			id: (await db.collection("phrases").findOne({ id: ids[0] })).collection
		});

		let updatedPhrases;

		try {
			await db.collection("phrases").updateMany({ id: { $in: ids } }, {
				$set: {
					collection: destId
				}
			});
			const cursor = await db.collection("phrases").find({ id: { $in: ids }});
			updatedPhrases = await cursor.toArray();
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to move phrases ${e}`);
		}

		try {
			await db.collection("collections").updateOne({ id: destId }, {
				$set: {
					"meta.phrasesCount": dest.meta.phrasesCount + ids.length,
					lastUpdate: new Date().getTime()
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update collection. ${e}`);
		}

		try {
			await db.collection("collections").updateOne({ id: col.id }, {
				$set: {
					"meta.phrasesCount": col.meta.phrasesCount - ids.length,
					lastUpdate: new Date().getTime()
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update collection. ${e}`);
		}

		return updatedPhrases;
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

	async deletePhrase({ id }: { id: string }, context: IContext) {
		const phrase = await this.getPhrase({ id });

		if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");

		const col = await db.collection("collections").findOne({ id: phrase.collection });

		try {
			await db.collection("phrases").deleteOne({ id });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete phrase. ${e}`);
		}

		try {
			await db.collection("collections").updateOne({ id: col.id }, {
				$set: {
					"meta.phrasesCount": col.meta.phrasesCount - 1,
					lastUpdate: new Date().getTime()
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update collection. ${e}`);
		}

		return "OK";
	}

	async deleteMany({ ids }: { ids: string[] }) {
		const col = await db.collection("collections").findOne({
			id: (await db.collection("phrases").findOne({ id: ids[0] })).collection
		});

		try {
			await db.collection("phrases").deleteMany({ id: { $in: ids } });
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to delete phrases. ${e}`);
		}

		try {
			await db.collection("collections").updateOne({ id: col.id }, {
				$set: {
					"meta.phrasesCount": col.meta.phrasesCount - ids.length,
					lastUpdate: new Date().getTime()
				}
			})
		} catch (e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to update collection. ${e}`);
		}

		return "OK";
	}

	async _updateStats(profile: string, day: number) {
		let todayStats;

		try {
			todayStats = await db.collection("stats").findOne({ profileId: profile, day });
		} catch(e) {
			globalErrorHandler(e);
			throw new Error(`Failed to obtain stats for update ${e}`);
		}

		try {
			if(!todayStats) {
				const stats = new StatsItem(profile, day);
				stats.createdPhrases++;
	
				await db.collection("stats").insertOne(stats);
			} else {
				await db.collection("stats").updateOne({ _id: todayStats._id }, {
					$set: {
						createdPhrases: todayStats.createdPhrases + 1
					}
				})
			}
		} catch(e) {
			globalErrorHandler(e);
			throw new Error(`Failed to update stats ${e}`);
		}
	}
}

export default new PhrasesController();