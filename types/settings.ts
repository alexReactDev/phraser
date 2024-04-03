export type TPhrasesOrder = "default" | "random";
export type TIntervalRepetitionDates = "exact" | "extended" | "auto";
export type TTextDifficulty = "simple" | "average" | "advanced" | "default";

export interface IUserSettings {
	id: string,
	userId: string,
	settings: ISettings
}

export type studyReminderFrequency = "disabled" | "weekly-multiple" | "daily" | "daily-multiple"
export interface ISettings {
	theme: string,
	phrasesOrder: TPhrasesOrder,
	repetitionsAmount: number,
	activeProfile: string,
	disableAutoCollections: boolean,
	autoCollectionsSize: number,
	intervalRepetitionDates: TIntervalRepetitionDates,
	useGPT3: boolean,
	textDifficulty: TTextDifficulty,
	disableSuggestions: boolean,
	suggestionsLanguage: string,
	statsReminderEnabled: boolean,
	phraseOfTheDayReminderEnabled: boolean,
	studyReminderFrequency: studyReminderFrequency
}
