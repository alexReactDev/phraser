import { GET_GENERATED_SENTENCES, GET_GENERATED_TEXT } from "@query/ai";
import { ICollection, TCollectionNameId } from "@ts/collections";
import { IPhrase } from "@ts/phrases";
import Learner from "./Learner";
import Repetition from "./RepetitionCreator";
import session from "@store/session";
import { client } from "src/apollo";
import { IPhraseData } from "@ts-frontend/learn";
import settings from "@store/settings";

export interface IValue {
	phrases: IPhrase[],
	text: string[]
}

export type TAIGeneratedTextMode = "text" | "sentences";

interface IParams {
	mode: TAIGeneratedTextMode,
	repetitionsAmount: number
}

export interface IRemembered {
	[key: string]: boolean
}

class AIGeneratedText extends Learner {
	phrases: IPhraseData[];
	collection: TCollectionNameId;
	mode: TAIGeneratedTextMode;
	repetitionsAmount: number;

	currentPhrases: IPhraseData[] = [];

	currentIdx = 0;
	itemsPerStep = 3;

	finishedCount = 0;
	repeatedCount = 0;

	constructor(phrases: IPhrase[], collection: ICollection, params: IParams) {
		super();
		this.phrases = phrases.map((phrase: IPhrase) => ({
			phrase,
			guessed: 0,
			forgotten: 0
		}));
		this.collection = collection;
		this.mode = params.mode;
		this.repetitionsAmount = params.repetitionsAmount;
	}

	async start() {
		this._updateCollectionMeta(this.collection.id);

		this.currentPhrases = this.phrases.slice(0, this.itemsPerStep);

		const value = await this.generate();

		return {
			done: false,
			value
		}
	}

	async next(remembered: IRemembered) {
		for(let key in remembered) {
			this._updatePhraseMeta(key, remembered[key]);

			const phraseIdx = this.phrases.findIndex((phrase: IPhraseData) => phrase.phrase.id === key);
			
			if(remembered[key]) {
				this.phrases[phraseIdx].guessed++;
			} else {
				this.phrases[phraseIdx].forgotten++;
			}

			if(this.phrases[phraseIdx].guessed === this.repetitionsAmount) this.finishedCount++;

			this.repeatedCount++;
		}

		if(this.finishedCount === this.phrases.length) {
			return {
				done: true,
				value: null
			}
		}

		while(true) {
			this.currentIdx = this.currentIdx + this.itemsPerStep;

			let phrases = this.phrases.slice(this.currentIdx, this.currentIdx + 3);
			const lack = this.itemsPerStep - phrases.length;

			if(lack !== 0) phrases = phrases.concat(this.phrases.slice(0, lack));

			const result = phrases.filter((phrase: IPhraseData) => phrase.guessed < this.repetitionsAmount);

			if(result.length > 0) {
				this.currentPhrases = result;
				break;
			}
		}

		const value = await this.generate();

		return {
			done: false,
			value
		}
	}

	finish() {
		const repetition = new Repetition({
			userId: session.data.userId!,
			profileId: settings.settings.activeProfile!,
			phrasesCount: this.phrases.length,
			totalForgotten: this.phrases.reduce((total, phrase: IPhraseData) => phrase.forgotten + total, 0),
			collectionName: this.collection.name,
			repetitionType: "AI generated text",
			repetitionsAmount: this.repetitionsAmount,
			phrasesRepetitions: this.phrases.map((phrase: IPhraseData) => ({
				id: phrase.phrase.id,
				guessed: phrase.guessed,
				forgotten: phrase.forgotten
			})),
			day: Math.trunc(new Date().getTime() / 86400000)
		});

		this._createRepetition(repetition);

		return repetition;
	}

	async generate() {
		let text;

		if(this.mode === "text") {
			text = [await this._generateText(this.currentPhrases.map((phrase: IPhraseData) => phrase.phrase.value))];
		} else {
			text = await this._generateSentences(this.currentPhrases.map((phrase: IPhraseData) => phrase.phrase.value));
		}

		return {
			phrases: this.currentPhrases.map((phrase: IPhraseData) => phrase.phrase),
			text
		}
	}
	
	changeMode(mode: TAIGeneratedTextMode) {
		this.mode = mode;
	}

	getProgress() {
		return {
			total: this.phrases.length * this.repetitionsAmount,
			progress: this.repeatedCount
		}
	}

	async _generateText(phrases: string[]) {
		return (await client.query({
			query: GET_GENERATED_TEXT,
			variables: {
				phrases
			},
			fetchPolicy: "no-cache"
		})).data.getGeneratedText;
	}

	async _generateSentences(phrases: string[]) {
		return (await client.query({
			query: GET_GENERATED_SENTENCES,
			variables: {
				phrases
			},
			fetchPolicy: "no-cache"
		})).data.getGeneratedSentences
	}
}

export default AIGeneratedText;