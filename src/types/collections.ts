export interface ICollection {
	id: number,
	name: string,
	isLocked: boolean,
	color: string,
	created: bigint,
	lastUpdate: bigint,
	meta: {
		phrasesCount: number,
		repetitionsCount: number
	},
	phrases: number[],
	repetitions: number[]
}