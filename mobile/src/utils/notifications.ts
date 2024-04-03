import AsyncStorage from '@react-native-async-storage/async-storage';
import loadingSpinner from '@store/loadingSpinner';
import * as Notifications from 'expo-notifications';
import errorMessage from "@store/toastMessage";
import { studyReminderFrequency } from '@ts/settings';

export async function updateStatsReminderNotification(enabled: boolean) {
	if(enabled) {
		try {
			const identifier = await Notifications.scheduleNotificationAsync({
				content: {
					title: "Don't forget to review your weekly stats 📅",
					body: "When you learn new language, it's important to keep track of your progress. Don't forget to review your stats for this week"
				},
				trigger: {
					weekday: 4,
					hour:  20,
					minute: 39,
					repeats: true,
					channelId: "statsReminder"
				}
			});	
			await AsyncStorage.setItem("statsReminderIdentifier", identifier);
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to schedule notification ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}
	} else {
		try {
			const identifier = await AsyncStorage.getItem("statsReminderIdentifier");
			if(identifier) {
				await Notifications.cancelScheduledNotificationAsync(identifier);
				await  AsyncStorage.removeItem("statsReminderIdentifier");
			};

		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to get cancel notification ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}
	}
}

export async function updateStudyReminderNotification(frequency: studyReminderFrequency) {
	const content = {
		title: "Did you repeat your saved phrases today? 💬",
		body: "When you build your vocabulary, it's important to repeat phrases that you've saved regularly"
	}

	if(frequency === "disabled") {
		try {
			const identifiersData = await AsyncStorage.getItem("studyReminderIdentifiers");

			if(identifiersData) {
				const identifiers = JSON.parse(identifiersData);

				for(let identifier of identifiers) {
					await Notifications.cancelScheduledNotificationAsync(identifier);
				}

				await AsyncStorage.removeItem("studyReminderIdentifiers");
				await AsyncStorage.setItem("studyReminderFrequency", frequency);
			}
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to get cancel notification ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}
	} else if (frequency === "weekly-multiple") {
		const identifiers = [];

		try {
			identifiers.push(await Notifications.scheduleNotificationAsync({
				content,
				trigger: {
					weekday: 3,
					hour: 21,
					minute: 15,
					repeats: true,
					channelId: "studyReminder"
				}
			}));
			identifiers.push(await Notifications.scheduleNotificationAsync({
				content,
				trigger: {
					weekday: 6,
					hour: 21,
					minute: 15,
					repeats: true,
					channelId: "studyReminder"
				}
			}));

			await AsyncStorage.setItem("studyReminderIdentifiers", JSON.stringify(identifiers));
			await AsyncStorage.setItem("studyReminderFrequency", frequency);
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to get schedule notifications ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}
	} else if (frequency === "daily") {
		const identifiers = [];

		try {
			identifiers.push(await Notifications.scheduleNotificationAsync({
				content,
				trigger: {
					hour: 20,
					minute: 50,
					repeats: true,
					channelId: "studyReminder"
				}
			}));

			await AsyncStorage.setItem("studyReminderIdentifiers", JSON.stringify(identifiers));
			await AsyncStorage.setItem("studyReminderFrequency", frequency);
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to get schedule notifications ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}
	} else if (frequency === "daily-multiple") {
		const identifiers = [];

		try {
			identifiers.push(await Notifications.scheduleNotificationAsync({
				content,
				trigger: {
					hour: 15,
					minute: 15,
					repeats: true,
					channelId: "studyReminder"
				}
			}));
			identifiers.push(await Notifications.scheduleNotificationAsync({
				content,
				trigger: {
					hour: 21,
					minute: 15,
					repeats: true,
					channelId: "studyReminder"
				}
			}));

			await AsyncStorage.setItem("studyReminderIdentifiers", JSON.stringify(identifiers));
			await AsyncStorage.setItem("studyReminderFrequency", frequency);
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to get schedule notifications ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}
	}
}