export interface ISettingsInput {
	theme: string,
	phrasesOrder: string,
	repetitionsAmount: string,
	activeProfile: string,
	autoCollectionSize: number,
	intervalRepetitionDates: "exact" | "extended" | "auto"
}