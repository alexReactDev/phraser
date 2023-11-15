export interface ICollection {
	id: number,
	name: string,
	isLocked: boolean,
	color: string,
	created: bigint,
	lastUpdate: bigint,
	meta: {
		phrasesCount: number,
		repetitionsCount: number,
		lastRepetition: number | null
	},
	phrases: number[],
	repetitions: number[]
}