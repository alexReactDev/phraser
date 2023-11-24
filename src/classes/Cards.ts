import { MUTATE_COLLECTION_META } from "@query/collections";
import { MUTATE_PHRASE_META } from "@query/phrases";
import { CREATE_REPETITION } from "@query/repetitions";
import session from "@store/session";
import { TCollectionNameId } from "@ts/collections";
import { IPhrase } from "@ts/phrases";
import { IRepetitionInput } from "@ts/repetitions";
import { TPhrasesOrder } from "@ts/settings";
import { client } from "src/apollo";

interface IPhraseData {
	phrase: IPhrase,
	guessed: number,
	forgotten: number
}

interface IParams {
	mode: TPhrasesOrder,
	repetitionsAmount: number
}

class Cards {
	collection: TCollectionNameId;
	mode: TPhrasesOrder;
	repetitionsAmount: number;
	phrases: IPhraseData[];
	finishedCount = 0;
	repeatedCount = 0;
	currentIdx = 0;

	constructor(collection: TCollectionNameId, phrases: IPhrase[], params: IParams) {
		this.collection = collection;
		this.mode = params.mode;
		this.repetitionsAmount = params.repetitionsAmount;
		this.phrases = phrases.map((phrase: IPhrase) => ({
			phrase,
			guessed: 0,
			forgotten: 0
		}));
	}

	start() {
		this._updateCollectionMeta(this.collection.id);

		const initial = this.phrases[0];

		return {
			done: false,
			value: {
				value: initial.phrase.value,
				translation: initial.phrase.translation
			}
		}
	}

	next(remembered: boolean) {
		const current = this.phrases[this.currentIdx];

		this._updatePhraseMeta(current.phrase.id, remembered);

		if(remembered) {
			++this.repeatedCount;
			++current.guessed
		} else {
			++current.forgotten
		}

		if(current.guessed === this.repetitionsAmount) ++this.finishedCount;

		if(this.finishedCount === this.phrases.length) {
			return {
				done: true,
				value: null
			}
		}

		if(this.mode === "default") {
			while(true) {
				++this.currentIdx;
				if(this.currentIdx > this.phrases.length - 1) this.currentIdx = 0;
				if(this.phrases[this.currentIdx].guessed !== this.repetitionsAmount) break;
			}
		} else {
			const filtered = this.phrases.filter((phrase: IPhraseData) => phrase.guessed !== this.repetitionsAmount);
			const randomFilteredIdx = Math.floor(Math.random() * filtered.length);
			this.currentIdx = this.phrases.findIndex((phrase: IPhraseData) => phrase.phrase.id === filtered[randomFilteredIdx].phrase.id);
		}

		const incoming = this.phrases[this.currentIdx];

		return {
			done: false,
			value: {
				value: incoming.phrase.value,
				translation: incoming.phrase.translation
			}
		}
	}

	finish() {
		const repetition = {
			userId: (session.data.userId!),
			phrasesCount: this.phrases.length,
			totalForgotten: this.phrases.reduce((total, phrase: IPhraseData) => phrase.forgotten + total, 0),
			collectionName: this.collection.name,
			repetitionType: "Cards",
			repetitionsAmount: this.repetitionsAmount,
			phrasesRepetitions: this.phrases.map((phrase: IPhraseData) => ({
				id: phrase.phrase.id,
				guessed: phrase.guessed,
				forgotten: phrase.forgotten
			})),
			created: new Date().getTime()
		}

		this._createRepetition(repetition);

		return repetition;
	}

	getProgress() {
		return {
			total: this.phrases.length * this.repetitionsAmount,
			progress: this.repeatedCount
		}
	}

	async _updateCollectionMeta(id: string) {
		await client.mutate({
			mutation: MUTATE_COLLECTION_META,
			variables: {
				id,
				input: {
					repetitionsCount: 1,
					lastRepetition: new Date().getTime()
				}
			}
		})
	}

	async _updatePhraseMeta(id: string, remembered: boolean) {
		await client.mutate({
			mutation: MUTATE_PHRASE_META,
			variables: {
				id,
				input: {
					guessed: remembered ? 1 : 0,
					forgotten: remembered ? 0 : 1,
					lastRepetition: new Date().getTime()
				}
			}
		})
	}

	async _createRepetition(repetition: IRepetitionInput) {
		await client.mutate({
			mutation: CREATE_REPETITION,
			variables: { input: repetition }
		})
	}
}

export default Cards;