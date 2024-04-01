import { IStatsItem } from "@ts/stats";

class StatsItem implements IStatsItem {
	day: number;
	profileId: string;
	createdCollections: number;
	createdPhrases: number;
	recordCreated: number;

	constructor(profileId: string, day: number) {
		this.profileId = profileId;
		this.day = day;
		this.createdCollections = 0;
		this.createdPhrases = 0;
		this.recordCreated = new Date().getTime()
	}
}

export default StatsItem;