import globalErrorHandler from "../misc/globalErrorHandler";
import db from "../model/db";

class NotificationsController {
	async updateNotificationsToken({ userId, token }: { userId: string, token: string }) {
		let tokens;

		try {
			tokens = await db.collection("users_tokens").findOne({ userId });
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get user notifications tokens ${e}`);
		}

		if(tokens?.expoPushTokens.includes(token)) return "Already reported";

		if(tokens) {
			try {
				await db.collection("users_tokens").updateOne({ userId }, {
					$push: {
						expoPushTokens: token
					}
				})
			} catch (e: any) {
				globalErrorHandler(e);
				throw new Error(`Server error. Failed to update user tokens ${e}`);
			}
		} else {
			try {
				await db.collection("users_tokens").insertOne({
					userId,
					expoPushTokens: [ token ]
				})
			} catch (e: any) {
				globalErrorHandler(e);
				throw new Error(`Server error. Failed to set user tokens ${e}`);
			}
		}

		return "OK";
	}
}

export default new NotificationsController()