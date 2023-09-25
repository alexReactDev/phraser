interface IRepetition {
	id: number,
	phrasesCount: number,
	totalGuessed: number,
	totalForgotten: number,
	totalRepeated: number,
	phrasesRepetitions: IPhraseRepetition[],
	created: number
}

interface IPhraseRepetition {
	id: number,
	guessed: number,
	forgotten: number,
	repeated: number
}