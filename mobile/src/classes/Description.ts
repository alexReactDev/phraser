import { IPhrase } from "@ts/phrases";
import Learner from "./Learner";
import { ICollection } from "@ts/collections";
import { IPhraseData } from "@ts-frontend/learn";
import { client } from "src/apollo";
import { GET_GENERATED_DESCRIPTION, GET_GENERATED_HINT_SENTENCE } from "@query/ai";
import Repetition from "./RepetitionCreator";
import session from "@store/session";
import settings from "@store/settings";

export interface IValue {
	hint: string,
	phrase: IPhrase
}

type TMode = "description" | "hintSentence" | "both";

interface IParams {
	repetitionsAmount: number,
	mode?: TMode
}

export class Description extends Learner {
	phrases: IPhraseData[];
	collection: ICollection;

	repetitionsAmount: number;
	mode: TMode;

	guessedCount = 0;
	finishedCount = 0;

	currentIdx = 0;

	constructor(phrases: IPhrase[], collection: ICollection, params: IParams) {
		super();
		this.phrases = phrases.map((phrase: IPhrase) => ({
			phrase,
			guessed: 0,
			forgotten: 0
		}));
		this.collection = collection;
		this.repetitionsAmount = params.repetitionsAmount;
		this.mode = params.mode || "both";
	}

	async start() {
		this._updateCollectionMeta(this.collection.id);

		const value = await this.generate();

		return {
			done: false,
			value
		}
	}

	async next(remembered: boolean) {
		const currentPhrase = this.phrases[this.currentIdx];

		this._updatePhraseMeta(currentPhrase.phrase.id, remembered);

		if(remembered) {
			this.guessedCount++;
			currentPhrase.guessed++;

			if(currentPhrase.guessed === this.repetitionsAmount) this.finishedCount++;
		} else {
			currentPhrase.forgotten++;
		}

		if(this.finishedCount === this.phrases.length) return {
			done: true,
			value: null
		}

		while(true) {
			this.currentIdx++;
			if(this.currentIdx === this.phrases.length) this.currentIdx = 0;
			if(this.phrases[this.currentIdx].guessed < this.repetitionsAmount) break;
		}

		const value = await this.generate();

		return {
			done: false,
			value
		}
	}

	finish() {
		const repetition = new Repetition({
			userId: (session.data.userId!),
			profileId: settings.settings.activeProfile!,
			phrasesCount: this.phrases.length,
			totalForgotten: this.phrases.reduce((total, phrase: IPhraseData) => phrase.forgotten + total, 0),
			collectionName: this.collection.name,
			repetitionType: "Description",
			repetitionsAmount: this.repetitionsAmount,
			phrasesRepetitions: this.phrases.map((phrase: IPhraseData) => ({
				id: phrase.phrase.id,
				guessed: phrase.guessed,
				forgotten: phrase.forgotten
			})),
		});

		this._createRepetition(repetition);

		return repetition;
	}

	getProgress() {
		return {
			total: this.phrases.length * this.repetitionsAmount,
			progress: this.guessedCount
		}
	}

	async generate() {
		const currentValue = this.phrases[this.currentIdx].phrase.value;

		let hint;

		if(this.mode === "description") {
			hint = await this._generateDescription(currentValue);
		} else if (this.mode === "hintSentence") {
			hint = await this._generateHintSentence(currentValue);
		} else {
			const random = Math.trunc(Math.random() * 2);

			if(random === 0) {
				hint = await this._generateDescription(currentValue);
			} else {
				hint = await this._generateHintSentence(currentValue);
			}
		}

		return {
			hint,
			phrase: this.phrases[this.currentIdx].phrase
		}
	}

	async _generateDescription(phrase: string) {
		return (await client.query({
			query: GET_GENERATED_DESCRIPTION,
			variables: {
				phrase
			},
			fetchPolicy: "no-cache"
		})).data.getGeneratedDescription;
	}

	async _generateHintSentence(phrase: string) {
		return (await client.query({
			query: GET_GENERATED_HINT_SENTENCE,
			variables: {
				phrase
			},
			fetchPolicy: "no-cache"
		})).data.getGeneratedHintSentence;
	}
}