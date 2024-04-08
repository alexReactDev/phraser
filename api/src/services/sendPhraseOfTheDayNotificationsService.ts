import notificationsController from "../controller/Notifications";
import globalErrorHandler from "../misc/globalErrorHandler";

let retries = 0;

export default async function sendPhraseOfTheDayNotificationService() {
	try {
		await notificationsController.sendPhraseOfTheDayNotifications();
	} catch (e: any) {
		if(retries >= 2) {
			globalErrorHandler(new Error(`Failed to send phrase of the day notifications after ${retries} retries. \n ${e}`));
			retries = 0;
			return;
		}

		setTimeout(sendPhraseOfTheDayNotificationService, retries === 0 ? 1000 * 2 : 1000 * 5);
		retries++;
	}
}