export type TPhrasesOrder = "default" | "random";
export type TIntervalRepetitionDates = "exact" | "extended" | "auto";
export type TTextDifficulty = "simple" | "average" | "advanced" | "default"

export interface IUserSettings {
	id: number,
	userId: number,
	settings: ISettings
}

export interface ISettings {
	theme: string,
	phrasesOrder: TPhrasesOrder,
	repetitionsAmount: number,
	activeProfile: string,
	disableAutoCollections: boolean,
	autoCollectionsSize: number,
	intervalRepetitionDates: TIntervalRepetitionDates,
	useGPT3: boolean,
	textDifficulty: TTextDifficulty
}
