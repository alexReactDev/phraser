export interface ICollectionInput {
	name: string,
	color: string,
	profile: string | number
}

export interface IChangeCollectionLockInput {
	isLocked: boolean
}