import { Worker } from "worker_threads";
import globalErrorHandler from "../misc/globalErrorHandler";

let retries = 0;

export default async function sendPhraseOfTheDayNotificationService() {
	const worker = new Worker("./src/services/sendPhraseOfTheDayNotificationWorker.ts", {
		execArgv: ["--require", "ts-node/register"]
	});

	function errorHandler(e: any) {
		if(retries >= 2) {
			globalErrorHandler(new Error(`Failed to send phrase of the day notifications after ${retries} retries. \n ${e}`));
			retries = 0;
			return;
		}

		setTimeout(sendPhraseOfTheDayNotificationService, retries === 0 ? 1000 * 2 : 1000 * 5);
		retries++;
	}

	worker.on("error", (e) => {
		errorHandler(e);
	});

	worker.on("exit", (code) => {
		if(code !== 0) {
			errorHandler(`Process exited with status code ${code}`);
		}
	});

	worker.on("message", (message) => {
		if(!message.done) {
			errorHandler("No notifications were successfully sent");
		}
	});
}