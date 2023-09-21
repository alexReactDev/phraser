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