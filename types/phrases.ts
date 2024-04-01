export interface IPhraseMeta {
	forgotten: number,
	guessed: number,
	lastRepetition: number
}

export interface IPhrase {
	id: string,
	value: string,
	translation: string,
	created: number,
	creationDate: string,
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