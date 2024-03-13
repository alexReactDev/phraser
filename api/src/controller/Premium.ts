import globalErrorHandler from "../misc/globalErrorHandler";
import db from "../model/db";

class PremiumController {
	async getPremiumData({ userId }: { userId: string }) {
		let data;

		try {
			data =  await db.collection("premium").findOne({ userId });
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get premium data ${e.toString()}`);
		}

		if(!data) {
			return {
				hasPremium: false
			}
		} else {
			return {
				hasPremium: true
			}
		}
	}
}

export default new PremiumController();