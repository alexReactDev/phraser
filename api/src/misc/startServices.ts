import activationLinksCleanUp from "./activationLinksCleanUp";
import sessionsCleanup from "./sessionsCleanup";

export default function startServices() {
	setInterval(sessionsCleanup, 1000 * 60 * 60 * 24); //Once per day
	setInterval(activationLinksCleanUp, 1000 * 60 * 60 * 24); //Once per day
}