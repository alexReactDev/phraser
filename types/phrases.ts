export interface IPhraseMeta {
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
	profile: string,
	collection: string,
	userId: string
}

export interface IPair {
	value: string,
	translation: string
}