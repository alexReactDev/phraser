export interface ICollectionInput {
	name: string,
	color: string,
	profile: string
}

export interface ICollectionMetaInput {
	repetitionsCount: number,
	lastRepetition: number
}

export interface IChangeCollectionLockInput {
	isLocked: boolean
}