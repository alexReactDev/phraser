import activationLinksCleanUp from "../services/activationLinksCleanUp";
import sessionsCleanup from "../services/sessionsCleanup";
import verificationCodesCleanup from "../services/verificationCodesCleanup";

export default function startServices() {
	setInterval(sessionsCleanup, 1000 * 60 * 60 * 24); //Once per day
	setInterval(activationLinksCleanUp, 1000 * 60 * 60 * 24); //Once per day
	setInterval(verificationCodesCleanup, 1000 * 60 * 60 * 24) //Once per day
}