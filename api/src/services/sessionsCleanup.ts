import db from "../model/db";
import globalErrorHandler from "../misc/globalErrorHandler";

export default async function sessionsCleanup() {
	try {
		await db.collection("active_sessions").deleteMany({
			expiresAt: {
				$lte: new Date().getTime()
			}
		})
	} catch (e: any) {
		globalErrorHandler(e);
	}
}