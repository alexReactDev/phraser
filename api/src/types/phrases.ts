export interface IPhraseInput {
	value: string,
	translation: string
}

export interface IPhraseMeta {
	repeated: number,
	forgotten: number,
	guessed: number
}

export interface IPhraseRepetitionInput extends IPhraseMeta {
	id: string | number
}

export interface IPhrase {
	id: number,
	value: string,
	translation: string,
	crated: bigint,
	lastUpdate: bigint,
	meta: {
		repeated: number,
		guessed: number,
		forgotten: number
	}
}