import globalErrorHandler from "../misc/globalErrorHandler";
import db from "../model/db";
const bcrypt = require("bcrypt");

class PremiumController {
	async getPremiumData({ userId }: { userId: string }) {
		let data;
		let hasPremium;

		try {
			data =  await db.collection("premium").findOne({ userId });
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get premium data ${e.toString()}`);
		}

		if(data?.expires > new Date().getTime()) hasPremium = true;

		if(!hasPremium) {
			return {
				hasPremium: false
			}
		} else {
			//All values provided directly, not via ... operator in order to avoid possible sensitive data leak
			return {
				hasPremium: true,
				userId: data.userId,
				created: data.created,
				expires: data.expires,
				plan: data.plan,
				status: data.status,
				isTrial: data.isTrial,
				transaction: {
					paid: data.transaction?.paid
				},
				trialData: {
					started: data.trialData?.started,
					ends: data.trialData?.ends
				}
			}
		}
	}

	async cancelSubscription({ userId, password }: { userId: string, password: string }) {
		let user;

		try {
			user = await db.collection("users").findOne({ id: userId });
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to cancel subscription - failed to verify password ${e}`)
		}

		if(!bcrypt.compareSync(password, user.password)) throw new Error("403. Access denied - wrong password");

		return "OK";
	}
}

export default new PremiumController();