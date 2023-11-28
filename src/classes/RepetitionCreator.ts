import { IRepetition, PhraseRepetition } from "@ts/repetitions"

type TProps = Omit<IRepetition, "id" | "created">

export default class Repetition implements Omit<IRepetition, "id"> {
	userId: number;
	phrasesCount: number;
	totalForgotten: number;
	collectionName: string;
	repetitionType: string;
	repetitionsAmount: number;
	phrasesRepetitions: PhraseRepetition[];
	created: number | BigInt;

	constructor(props: TProps) {
		this.userId = props.userId;
		this.phrasesCount = props.phrasesCount;
		this.totalForgotten = props.totalForgotten;
		this.collectionName = props.collectionName;
		this.repetitionType = props.repetitionType;
		this.repetitionsAmount = props.repetitionsAmount;
		this.phrasesRepetitions = props.phrasesRepetitions;
		this.created = new Date().getTime()
	}
}