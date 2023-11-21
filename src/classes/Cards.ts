import session from "@store/session";
import { IPhrase } from "@ts/phrases";
import { IRepetitionInput } from "@ts/repetitions";
import { TPhrasesOrder } from "@ts/settings";

interface IPhraseData {
	phrase: IPhrase,
	guessed: number,
	forgotten: number
}

interface IParams {
	mode: TPhrasesOrder,
	repetitionsAmount: number
}

export class Cards {
	name: string;
	mode: TPhrasesOrder;
	repetitionsAmount: number;
	phrases: IPhraseData[];
	finishedCount = 0;
	repeatedCount = 0;
	currentIdx = 0;

	constructor(name: string, phrases: IPhrase[], params: IParams) {
		this.name = name;
		this.mode = params.mode;
		this.repetitionsAmount = params.repetitionsAmount;
		this.phrases = phrases.map((phrase: IPhrase) => ({
			phrase,
			guessed: 0,
			forgotten: 0
		}));
	}

	start() {
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
			totalOmitted: 0, //Not applicable
			collectionName: this.name,
			repetitionType: "Cards",
			repetitionsAmount: this.repetitionsAmount,
			phrasesRepetitions: this.phrases.map((phrase: IPhraseData) => ({
				id: phrase.phrase.id,
				guessed: phrase.guessed,
				forgotten: phrase.forgotten
			})),
			omittedPhrases: [], //Not applicable
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

	async _updatePhraseMeta(id: string, remembered: boolean) {

	}

	async _createRepetition(repetition: IRepetitionInput) {

	}
}