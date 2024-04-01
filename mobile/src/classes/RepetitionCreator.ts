import { IRepetition, PhraseRepetition, repetitionType } from "@ts/repetitions"

type TProps = Omit<IRepetition, "id" | "created">

export default class Repetition implements Omit<IRepetition, "id"> {
	userId: string;
	profileId: string;
	phrasesCount: number;
	totalForgotten: number;
	collectionName: string;
	repetitionType: repetitionType;
	repetitionsAmount: number;
	phrasesRepetitions: PhraseRepetition[];
	created: number | BigInt;
	day: number;

	constructor(props: TProps) {
		this.profileId = props.profileId;
		this.userId = props.userId;
		this.phrasesCount = props.phrasesCount;
		this.totalForgotten = props.totalForgotten;
		this.collectionName = props.collectionName;
		this.repetitionType = props.repetitionType;
		this.repetitionsAmount = props.repetitionsAmount;
		this.phrasesRepetitions = props.phrasesRepetitions;
		this.created = new Date().getTime();
		this.day = props.day;
	}
}