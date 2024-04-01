import { ILearningMethods, ILearningMethodsValues, IRepetitionStatsItem, IStatsItem } from "@ts/stats";
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
	async getStatsByPeriod({ from, to, profileId }: { from: number, to: number, profileId: string }, context: IContext) {
		let visitedDays;

		try {
			const cursor = await db.collection("visits").find({
				userId: context.auth.userId,
				day: {
					$gte: from,
					$lt: to
				}
			})

			visitedDays = await cursor.count();
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to get visits data ${e}`);
		}

		let stats: StatsItem[];

		try {
			const cursor = await db.collection("stats").find({
				profileId,
				day: {
					$gte: from,
					$lt: to
				}
			});

			stats = await cursor.toArray();
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to get stats ${e}`);
		}
		
		const creationStats = this._getCreationStats(stats, visitedDays);

		let repetitions;

		try {
			const cursor = await db.collection("repetitions").find({
				profileId,
				day: {
					$gte: from,
					$lt: to
				}
			})

			repetitions = await cursor.toArray();
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to get repetitions data ${e}`);
		}

		const repetitionStats = this._getRepetitionStats(repetitions, visitedDays);
		
		return {
			dailyStats: stats,
			...creationStats,
			...repetitionStats,
			visitedDays,
			date: {
				from,
				to
			}
		};
	}

	async reportVisit({ userId, day }: { userId: string, day: number }) {
		const todaysVisit = await db.collection("visits").findOne({ userId, day });

		if(!todaysVisit) {
			await db.collection("visits").insertOne({
				userId,
				day,
				recordCreated: new Date().getTime()
			});
		}

		if(todaysVisit) return "Already reported"
		return "OK";
	}

	_getCreationStats(stats: IStatsItem[], visitedDays: number) {
		const total = stats.reduce((total, item) => {
			return {
				totalPhrases: total.totalPhrases + item.createdPhrases,
				totalCollections: total.totalCollections + item.createdCollections
			}
		}, {
			totalPhrases: 0,
			totalCollections: 0
		});

		const averagePhrases = (total.totalPhrases / visitedDays) || 0;
		const averageCollections = (total.totalCollections / visitedDays) || 0;

		return {
			createdPhrasesTotal: total.totalPhrases,
			createdCollectionsTotal: total.totalCollections,
			createdPhrasesAverage: +averagePhrases.toFixed(2),
			createdCollectionsAverage: +averageCollections.toFixed(2),
		}
	}

	_getRepetitionStats(repetitions: IRepetition[], visitedDays: number) {
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

			let dailyRepetition = dailyRepetitions.find((item) => item.day === repetition.day);

			if(!dailyRepetition) {
				dailyRepetition = new RepetitionStatsItem(repetition.day);
				dailyRepetitions.push(dailyRepetition);
			}

			dailyRepetition.repeatedCollections++;
			dailyRepetition.repeatedPhrases += repetition.phrasesCount;
			dailyRepetition.learningMethods[learningMethodAliases[repetition.repetitionType]]++;
		});

		const repeatedCollectionsAverage = (repeatedCollectionsTotal / visitedDays) || 0;
		const repeatedPhrasesAverage = (repeatedPhrasesTotal / visitedDays) || 0;
		const rightAnswersAveragePercentage = (totalPercentage / repeatedCollectionsTotal) || 0;

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
