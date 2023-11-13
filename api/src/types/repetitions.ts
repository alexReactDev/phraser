export interface PhraseRepetition {
	id: number,
	guessed: number,
	forgotten: number,
	repeated: number
}

export interface IRepetition {
	id: string,
	userId: number,
	phrasesCount: number,
	totalGuessed: number,
	totalForgotten: number,
	totalRepeated: number,
	totalOmitted: number,
	collectionName: string,
	repetitionType: string,
	phrasesRepetitions: [PhraseRepetition],
	omittedPhrases: [number],
	created: BigInt | number
}

export type IRepetitionInput = Omit<IRepetition, "id">