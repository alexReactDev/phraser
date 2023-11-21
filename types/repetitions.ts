export interface PhraseRepetition {
	id: string,
	guessed: number,
	forgotten: number
}

export interface IRepetition {
	id: string,
	userId: number,
	phrasesCount: number,
	totalForgotten: number,
	totalOmitted: number,
	collectionName: string,
	repetitionType: string,
	repetitionsAmount: number,
	phrasesRepetitions: PhraseRepetition[],
	omittedPhrases: number[],
	created: BigInt | number
}

export type IRepetitionInput = Omit<IRepetition, "id">