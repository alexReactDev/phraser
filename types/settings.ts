export type TPhrasesOrder = "default" | "random";
export type TIntervalRepetitionDates = "exact" | "extended" | "auto";

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
	autoCollectionsSize: number,
	intervalRepetitionDates: TIntervalRepetitionDates
}
