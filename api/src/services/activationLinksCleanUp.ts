import db from "../model/db";
import globalErrorHandler from "../misc/globalErrorHandler";

export default async function activationLinksCleanUp() {
	try {
		await db.collection("verification_links").deleteMany({
			expiresAt: {
				$lte: new Date().getTime()
			}
		})
	} catch (e: any) {
		globalErrorHandler(e);
	}
}