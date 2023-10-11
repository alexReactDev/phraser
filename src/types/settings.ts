export interface IUserSettings {
	id: number,
	userId: number,
	settings: ISettings
}

export interface ISettings {
	theme: string,
	phrasesOrder: string,
	repetitionsAmount: number,
	activeProfile: number
}

export interface IInitialSettings {
	theme: string | null,
	phrasesOrder: string | null,
	repetitionsAmount: number | null,
	activeProfile: number | null
}