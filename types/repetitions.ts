export type repetitionType = "Cards" | "AI generated text" | "Description"

export interface PhraseRepetition {
	id: string,
	guessed: number,
	forgotten: number
}

export interface IRepetition {
	id: string,
	userId: string,
	profileId: string,
	phrasesCount: number,
	totalForgotten: number,
	collectionName: string,
	repetitionType: repetitionType,
	repetitionsAmount: number,
	phrasesRepetitions: PhraseRepetition[],
	created: BigInt | number
}

export type IRepetitionInput = Omit<IRepetition, "id">