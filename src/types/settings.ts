export interface IUserSettings {
	id: number,
	userId: number,
	settings: ISettings
}

export interface ISettings {
	theme: string,
	phrasesOrder: string,
	repetitionsAmount: number,
	activeProfile: string
}

export interface IInitialSettings {
	theme: string | null,
	phrasesOrder: string | null,
	repetitionsAmount: number | null,
	activeProfile: string | null
}