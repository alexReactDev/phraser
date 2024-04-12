import { TPhrasesOrder } from "@ts/settings";
import Learner from "./Learner";
import { TCollectionNameId } from "@ts/collections";
import { IPhrase } from "@ts/phrases";
import { client } from "src/apollo";
import { GET_AI_GENERATED_IMAGE } from "@query/ai";
import Repetition from "./RepetitionCreator";
import session from "@store/session";
import settings from "@store/settings";

interface IPhraseData {
	phrase: IPhrase,
	guessed: number,
	forgotten: number
}

interface IParams {
	mode: TPhrasesOrder,
	repetitionsAmount: number,
	errorHandler: (e: any) => void
}

interface ImageData {
	url: string
}

interface IData {
	loaded: true,
	promise: null,
	data: ImageData
}

interface IDataLoading {
	loaded: false,
	promise: Promise<any>,
	data: null
}

class AIGeneratedImage extends Learner {
	collection: TCollectionNameId;
	mode: TPhrasesOrder;
	repetitionsAmount: number;
	phrases: IPhraseData[];
	errorHandler: (e: any) => void;
	finishedCount = 0;
	repeatedCount = 0;
	currentIdx = 0;
	incomingIdx = 0;
	loadedData: IData | IDataLoading = {
		loaded: false,
		promise: Promise.resolve(null),
		data: null
	};

	constructor(phrases: IPhrase[], collection: TCollectionNameId, params: IParams) {
		super();
		this.collection = collection;
		this.mode = params.mode;
		this.repetitionsAmount = params.repetitionsAmount;
		this.phrases = phrases.map((phrase: IPhrase) => ({
			phrase,
			guessed: 0,
			forgotten: 0
		}));
		this.errorHandler = params.errorHandler;
	}

	async start() {
		this._updateCollectionMeta(this.collection.id);

		const initialPhrase = this.phrases[0];
		const initialData = await this.generate();

		if(this.finishedCount !== this.phrases.length - 1) {
			this._selectIncomingIdx();
			this.generate();
		}

		return {
			done: false,
			value: {
				value: initialData.url,
				translation: initialPhrase.phrase.translation
			}
		}
	}

	async next(remembered: boolean) {
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

		this.currentIdx = this.incomingIdx;
		const currentPhrase = this.phrases[this.currentIdx];

		if(!this.loadedData.loaded) await this.loadedData.promise;

		const loadedData = this.loadedData;

		if(this.finishedCount !== this.phrases.length - 1) {
			this._selectIncomingIdx();
			this.generate();
		}

		return {
			done: false,
			value: {
				value: loadedData.data!.url,
				translation: currentPhrase.phrase.translation
			}
		}
	}

	finish() {
		const repetition = new Repetition({
			userId: (session.data.userId!),
			profileId: settings.settings.activeProfile!,
			phrasesCount: this.phrases.length,
			totalForgotten: this.phrases.reduce((total, phrase: IPhraseData) => phrase.forgotten + total, 0),
			collectionName: this.collection.name,
			repetitionType: "AI generated image",
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

	getProgress() {
		return {
			total: this.phrases.length * this.repetitionsAmount,
			progress: this.repeatedCount
		}
	}

	_selectIncomingIdx() {
		if(this.mode === "default") {
			while(true) {
				++this.incomingIdx;
				if(this.incomingIdx > this.phrases.length - 1) this.incomingIdx = 0;
				if(this.phrases[this.incomingIdx].guessed !== this.repetitionsAmount) break;
			}
		} else {
			const filtered = this.phrases.filter((phrase: IPhraseData) => phrase.guessed !== this.repetitionsAmount);
			const randomFilteredIdx = Math.floor(Math.random() * filtered.length);
			this.incomingIdx = this.phrases.findIndex((phrase: IPhraseData) => phrase.phrase.id === filtered[randomFilteredIdx].phrase.id);
		}
	}

	async generate() {
		this.loadedData = {
			loaded: false,
			promise: client.query({
				query: GET_AI_GENERATED_IMAGE,
				variables: {
					phrase: this.phrases[this.incomingIdx].phrase.value
				},
				fetchPolicy: "no-cache"
			}),
			data: null
		}

		let loadedData;

		try {
			loadedData = await this.loadedData.promise;
		} catch (e: any) {
			console.log(e);
			this.errorHandler(e);
			return;
		}

		this.loadedData = {
			loaded: true,
			promise: null,
			data: loadedData.data.getAIGeneratedImage
		}
		
		return loadedData.data.getAIGeneratedImage;
	}
}

export default AIGeneratedImage;