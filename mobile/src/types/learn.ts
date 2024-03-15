import { IPhrase } from "@ts/phrases"

export interface ProgressData {
	total: number,
	progress: number
}

export interface IPhraseData {
	phrase: IPhrase,
	guessed: number,
	forgotten: number
}