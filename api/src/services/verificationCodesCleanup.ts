import db from "../model/db";
import globalErrorHandler from "../misc/globalErrorHandler";

export default async function verificationCodesCleanup() {
	try {
		await db.collection("verification_codes").deleteMany({
			expiresAt: {
				$lte: new Date().getTime()
			}
		})
	} catch (e: any) {
		globalErrorHandler(e);
	}
}