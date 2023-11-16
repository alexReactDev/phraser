export interface IPhraseInput {
	value: string,
	translation: string
}

export interface IPhraseMeta {
	repeated: number,
	forgotten: number,
	guessed: number,
	lastRepetition: number
}

export interface IPhraseRepetitionInput extends IPhraseMeta {
	id: string
}

export interface IPhrase {
	id: string,
	value: string,
	translation: string,
	crated: bigint,
	lastUpdate: bigint,
	meta: IPhraseMeta,
	profile: string
}