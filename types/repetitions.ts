export interface PhraseRepetition {
	id: string,
	guessed: number,
	forgotten: number
}

export interface IRepetition {
	id: string,
	userId: string,
	phrasesCount: number,
	totalForgotten: number,
	collectionName: string,
	repetitionType: string,
	repetitionsAmount: number,
	phrasesRepetitions: PhraseRepetition[],
	created: BigInt | number
}

export type IRepetitionInput = Omit<IRepetition, "id">