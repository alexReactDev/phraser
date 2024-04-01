import { IRepetitionStatsItem } from "@ts/stats";
import CustomDate from "./CustomDate";

export default class RepetitionStatsItem implements IRepetitionStatsItem {
	day: number;
	learningMethods: { cards: number; aiGeneratedText: number; description: number; };
	repeatedCollections: number;
	repeatedPhrases: number;

	constructor(day: number) {
		this.day = day;
		this.repeatedCollections = 0;
		this.repeatedPhrases = 0;
		this.learningMethods = {
			aiGeneratedText: 0,
			cards: 0,
			description: 0
		}
	}
}