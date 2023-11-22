import { IPhraseMeta } from "@ts/phrases"

export interface IPhraseInput {
	value: string,
	translation: string
}

export interface IPhraseRepetitionInput {
	guessed: number,
	forgotten: number,
	lastRepetition: number
}