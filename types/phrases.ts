export interface IPhraseMeta {
	repeated: number,
	forgotten: number,
	guessed: number,
	lastRepetition: number
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