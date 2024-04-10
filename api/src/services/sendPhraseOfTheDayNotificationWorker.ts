import globalErrorHandler from "../misc/globalErrorHandler";
import db from "../model/db";
import phrasesController from "../controller/Phrases";
import { parentPort } from "worker_threads";

async function sendPhraseOfTheDayNotifications() {
	let eligibleUsers;

	try {
		const cursor = await db.collection("settings").find({ "settings.phraseOfTheDayReminderEnabled": {
			$eq: true
		}});

		eligibleUsers = await cursor.toArray();
	}
	catch(e) {
		console.log(e)
		throw new Error(`Server error. Failed to get eligible users settings ${e}`)
	}

	const results = [];
	let successfulSends = 0

	for (let user of eligibleUsers) {
		let tokens;

		try {
			const data = (await db.collection("users_tokens").findOne({ userId: user.userId }));
			tokens = data?.expoPushTokens || [];
		}
		catch(e) {
			globalErrorHandler(e);
			results.push(new Error(`Server error. Failed to get user notifications tokens \n ${e} \n ${user.userId}`));
		}

		let phraseOfTheDay;

		try {
			phraseOfTheDay = await phrasesController.getPhraseOfTheDay({ userId: user.userId });
		} catch (e) {
			globalErrorHandler(e);
			results.push(new Error(`Server error. Failed to get phrase of the day for user \n ${e} \n ${user.userId}`))
		}

		for (let token of tokens) {
			try {
				const res = await fetch('https://exp.host/--/api/v2/push/send', {
					method: 'POST',
					headers: {
					  Accept: 'application/json',
					  'Accept-encoding': 'gzip, deflate',
					  'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						data: {
							phrase: phraseOfTheDay.id,
							value: phraseOfTheDay.value,
							translation: phraseOfTheDay.translation
						},
						to: token
					}),
				});
				
				if(!res.ok) throw res;
				const ticket = await res.json();

				if(ticket.data.status != "ok") throw ticket;

				results.push(ticket);
				successfulSends++;
			} catch (e: any) {
				globalErrorHandler(e);

				if(e.message?.includes("is not a registered push notification recipient")) {
					await db.collection("users_tokens").updateOne({
						expoPushTokens: {
							$pull: token
						}
					})
				}

				results.push(new Error(`Server error. Failed to send notification to user \n ${e} \n ${user.userId}`))
			}
		}
	}

	if(successfulSends === 0 && eligibleUsers.length !== 0) {
		parentPort?.postMessage({ done: false, results });
		process.exit();
	}

	parentPort?.postMessage({ done: true, results });
	process.exit();
}

sendPhraseOfTheDayNotifications();