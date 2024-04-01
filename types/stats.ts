export type statsPeriodType = "week" | "month";
export interface IStatsItem {
	day: number,
	profileId: string,
	createdPhrases: number,
	createdCollections: number,
	recordCreated: number
}

export interface ILearningMethods {
	[key: string]: string
}

export interface ILearningMethodsValues {
	[key: string]: number
}


export interface IRepetitionStatsItem {
	day: number,
	repeatedPhrases: number,
	repeatedCollections: number,
	learningMethods: ILearningMethodsValues
}

export interface IStatsDate {
	from: number,
	to: number
}

export interface IStats {
	date: IStatsDate,
	dailyStats: IStatsItem[],
	createdPhrasesTotal: number,
	createdCollectionsTotal: number,
	createdPhrasesAverage: number,
	createdCollectionsAverage: number,
	dailyRepetitions: IRepetitionStatsItem[],
	repeatedPhrasesTotal: number,
	repeatedCollectionsTotal: number,
	repeatedPhrasesAverage: number,
	repeatedCollectionsAverage: number,
	rightAnswersAveragePercentage: number,
	favoriteLearningMethod: string,
	visitedDays: number,
	visitedPercentage: number
}