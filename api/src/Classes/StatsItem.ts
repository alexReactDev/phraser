import { IStatsItem } from "@ts/stats";
import CustomDate from "./CustomDate";

class StatsItem implements IStatsItem {
	date: number;
	profileId: string;
	createdCollections: number;
	createdPhrases: number;

	constructor(profileId: string) {
		this.profileId = profileId;
		this.date = new CustomDate().resetDay().getTime();
		this.createdCollections = 0;
		this.createdPhrases = 0;
	}
}

export default StatsItem;