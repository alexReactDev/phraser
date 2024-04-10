import activationLinksCleanUp from "../services/activationLinksCleanUp";
import sendPhraseOfTheDayNotificationService from "../services/sendPhraseOfTheDayNotificationsService";
import sessionsCleanup from "../services/sessionsCleanup";
import verificationCodesCleanup from "../services/verificationCodesCleanup";

export default function startServices(runOnStartup = true) {
	if(runOnStartup) sessionsCleanup();
	setInterval(sessionsCleanup, 1000 * 60 * 60 * 24); //Once per day

	if(runOnStartup) activationLinksCleanUp();
	setInterval(activationLinksCleanUp, 1000 * 60 * 60 * 24); //Once per day

	if(runOnStartup) verificationCodesCleanup();
	setInterval(verificationCodesCleanup, 1000 * 60 * 60 * 24) //Once per day

	if(runOnStartup) sendPhraseOfTheDayNotificationService();
	setInterval(sendPhraseOfTheDayNotificationService, 1000 * 60 * 60 * 24); //Once per day
}