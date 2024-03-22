import { ILearningMethods, ILearningMethodsValues, IRepetitionStatsItem, IStatsItem, statsPeriodType } from "@ts/stats";
import CustomDate from "../Classes/CustomDate";
import globalErrorHandler from "../misc/globalErrorHandler";
import db from "../model/db";
import StatsItem from "../Classes/StatsItem";
import { IContext } from "@ts-backend/context";
import { IRepetition } from "@ts/repetitions";
import RepetitionStatsItem from "../Classes/RepetitionStatsItem";


export const learningMethodAliases: ILearningMethods = {
	"Cards": "cards",
	"AI generated text": "aiGeneratedText",
	"Description": "description"
};

class Stats {
	async getStatsByPeriod({ period, profileId }: { period: statsPeriodType, profileId: string }, context: IContext) {
		let agoMS;
		let todayMS = new CustomDate().resetDay().getTime();

		switch(period) {
			case "week": agoMS = 1000 * 60 * 60 * 24 * 7; //7 days
			break;
			case "month": agoMS = 1000 * 60 * 60 * 24 * 30; //30 days
		}

		const timestamp = new CustomDate(new Date().getTime() - agoMS).resetDay().getTime();

		let stats: StatsItem[];

		try {
			const cursor = await db.collection("stats").find({
				profileId,
				date: {
					$gte: timestamp,
					$lt: todayMS
				}
			});

			stats = await cursor.toArray();
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to get stats ${e}`);
		}
		
		const creationStats = this._getCreationStats(stats);

		let repetitions;

		try {
			const cursor = await db.collection("repetitions").find({
				profileId,
				created: {
					$gte: timestamp,
					$lt: todayMS
				}
			})

			repetitions = await cursor.toArray();
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to get repetitions data ${e}`);
		}

		const repetitionStats = this._getRepetitionStats(repetitions);

		let visitedDays;

		try {
			const cursor = await db.collection("visits").find({
				userId: context.auth.userId,
				date: {
					$gte: timestamp,
					$lt: todayMS
				}
			})

			visitedDays = await cursor.count();
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to get visits data ${e}`);
		}

		const visitedPercentage = visitedDays / (period === "week" ? 7 : 30) * 100;
		
		return {
			dailyStats: stats,
			...creationStats,
			...repetitionStats,
			visitedDays,
			visitedPercentage: +visitedPercentage.toFixed(0),
			date: {
				from: timestamp,
				to: todayMS - 1000 * 60 * 60 * 24
			}
		};
	}

	async reportVisit({ userId }: { userId: string }) {
		const todaysDay = new CustomDate().resetDay().getTime();
		const todaysVisit = await db.collection("visits").findOne({ userId, date: todaysDay });

		if(todaysVisit) return "Already reported";

		await db.collection("visits").insertOne({
			userId,
			date: todaysDay
		})

		return "OK"
	}

	_getCreationStats(stats: IStatsItem[]) {
		const total = stats.reduce((total, item) => {
			return {
				totalPhrases: total.totalPhrases + item.createdPhrases,
				totalCollections: total.totalCollections + item.createdCollections
			}
		}, {
			totalPhrases: 0,
			totalCollections: 0
		});

		const averagePhrases = total.totalPhrases / stats.length;
		const averageCollections = total.totalCollections / stats.length;

		return {
			createdPhrasesTotal: total.totalPhrases,
			createdCollectionsTotal: total.totalCollections,
			createdPhrasesAverage: +averagePhrases.toFixed(2),
			createdCollectionsAverage: +averageCollections.toFixed(2),
		}
	}

	_getRepetitionStats(repetitions: IRepetition[]) {
		const dailyRepetitions: IRepetitionStatsItem[] = [];
		let repeatedCollectionsTotal = 0;
		let repeatedPhrasesTotal = 0;
		let totalPercentage = 0;
		let totalLearningMethods: ILearningMethodsValues = {
			cards: 0,
			aiGeneratedText: 0,
			description: 0
		};

		repetitions.forEach((repetition: IRepetition) => {
			repeatedCollectionsTotal++;
			repeatedPhrasesTotal = repeatedPhrasesTotal + repetition.phrasesCount;

			const guessed = repetition.phrasesCount * repetition.repetitionsAmount;
			const steps = repetition.totalForgotten + guessed;
			const percentage = +(guessed / steps * 100).toFixed(2);

			totalPercentage = totalPercentage + percentage;

			totalLearningMethods[learningMethodAliases[repetition.repetitionType]]++;

			const date = new CustomDate((repetition.created as number)).resetDay().getTime();
			let dailyRepetition = dailyRepetitions.find((item) => item.date === date);

			if(!dailyRepetition) {
				dailyRepetition = new RepetitionStatsItem(date);
				dailyRepetitions.push(dailyRepetition);
			}

			dailyRepetition.repeatedCollections++;
			dailyRepetition.repeatedPhrases += repetition.phrasesCount;
			dailyRepetition.learningMethods[learningMethodAliases[repetition.repetitionType]]++;
		});

		const repeatedCollectionsAverage = repeatedCollectionsTotal / dailyRepetitions.length;
		const repeatedPhrasesAverage = repeatedPhrasesTotal / dailyRepetitions.length;
		const rightAnswersAveragePercentage = totalPercentage / repeatedCollectionsTotal;

		return {
			dailyRepetitions,
			repeatedPhrasesTotal,
			repeatedCollectionsTotal,
			repeatedCollectionsAverage: +repeatedCollectionsAverage.toFixed(2),
			repeatedPhrasesAverage: +repeatedPhrasesAverage.toFixed(2),
			rightAnswersAveragePercentage: +rightAnswersAveragePercentage.toFixed(2),
			favoriteLearningMethod: this._getFavoriteLearningMethod(totalLearningMethods)
		}
	}

	_getFavoriteLearningMethod(learningMethodsValues: ILearningMethodsValues) {
		let biggestLearningMethodValue = 0;
		let favoriteLearningMethod = "";
		const learningMethodsKeys = [];

		for (let key in learningMethodsValues) {
			if(learningMethodsValues[key] > biggestLearningMethodValue) {
				biggestLearningMethodValue = learningMethodsValues[key];
			}
		}

		for(let key in learningMethodsValues) {
			if(learningMethodsValues[key] === biggestLearningMethodValue) {
				learningMethodsKeys.push(key);
			}
		}

		learningMethodsKeys.forEach((methodKey: string) => {
			for(let key in learningMethodAliases) {
				if(learningMethodAliases[key] === methodKey) {
					favoriteLearningMethod = favoriteLearningMethod ? favoriteLearningMethod + ", " + key : key;
				}
			}
		})

		return favoriteLearningMethod;
	}
}

export default new Stats();
