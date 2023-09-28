import { IPhrase, IPhraseInput, IPhraseRepetitionInput } from "../types/phrases";

const db = require("../model/db.ts");

class PhrasesController {
	async getPhrase({ id }: { id: string | number }) {
		let phrase;

		try {
			phrase = await db.collection("phrases").findOne({ id: +id });
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		return phrase;
	}

	async getPhrasesByCollection({ id }: { id: string | number }) {
		let phrases;

		try {
			const collection = await db.collection("collections").findOne({ id: +id });

			const cursor = await db.collection("phrases").find({ id: { $in: collection.phrases }});

			phrases = await cursor.toArray();
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		return phrases;
	}

	async createPhrase({ input, collection }: { input: IPhraseInput, collection: string | number }) {
		const timestamp = new Date().getTime();

		const phrase = {
			...input,
			id: timestamp,
			created: timestamp,
			lastUpdate: timestamp,
			meta: {
				repeated: 0,
				guessed: 0,
				forgotten: 0
			}
		}

		try {
			await db.collection("phrases").insertOne(phrase);
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		try {
			const col = await db.collection("collections").findOne({ id: +collection });
			await db.collection("collections").updateOne({ id: +collection }, {
				$set: {
					phrases: [...col.phrases, timestamp]
				}
			})
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		return phrase;
	}

	async mutatePhrase({ id, input, collection }: { id: string | number, input: IPhraseInput, collection: string | number}) {
		try {
			await db.collection("phrases").updateOne({ id: +id }, {
				$set: {
					value: input.value,
					translation: input.translation
				}
			})
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		try {
			const oldCollection = await db.collection("collections").findOne({
				phrases: {
					$in: [+id]
				}
			})

			console.log(oldCollection);
			console.log(+id);

			if(collection && oldCollection.id !== +collection) {
				await db.collection("collections").updateOne({ id: oldCollection.id }, {
					$set: {
						phrases: oldCollection.phrases.filter((phrase: string | number) => phrase !== +id)
					}
				})

				const newCollection = await db.collection("collections").findOne({ id: +collection });

				if(!newCollection) return "Code 400. Bad request";

				await db.collection("collections").updateOne({ id: +collection }, {
					$set: {
						phrases: [ ...newCollection.phrases, +id ]
					}
				})
			}
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		return "OK";
	}

	async mutatePhraseMeta({ input }: { input: [IPhraseRepetitionInput] }) {
		const phrasesIds = input.map((repetition) => +repetition.id);

		console.log(input);
		console.log(phrasesIds);
		
		let phrases;

		try {
			const cursor = await db.collection("phrases").find({ id: {
				$in: phrasesIds
			}})

			phrases = await cursor.toArray();
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		console.log(phrases);

		let updatePromises = [];

		for(let i = 0; i < input.length; i++) {
			const { id, ...meta } = input[i];
			const oldMeta = phrases.find((phrase: IPhrase) => phrase.id === +id).meta;

			let promise = db.collection("phrases").updateOne({ id: +id }, {
				$set: {
					meta: {
						repeated: oldMeta.repeated + +meta.repeated,
						guessed: oldMeta.guessed + +meta.guessed,
						forgotten: oldMeta.forgotten + +meta.forgotten
					}
				}
			})

			updatePromises.push(promise);
		}

		try {
			await Promise.all(updatePromises);
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		return "OK";
	}	

	async deletePhrase({ id }: { id: string | number }) {
		try {
			await db.collection("phrases").deleteOne({ id: +id });
		} catch (e) {
			console.log(e);
			return `Error! ${e}`;
		}

		return "OK";
	}
}

module.exports = new PhrasesController();