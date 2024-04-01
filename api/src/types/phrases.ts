export interface IPhraseInput {
	value: string,
	translation: string,
	day: number
}

export interface IPhraseRepetitionInput {
	guessed: number,
	forgotten: number,
	lastRepetition: number
}