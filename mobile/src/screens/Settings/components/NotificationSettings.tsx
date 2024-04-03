import { Button, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import SettingsGroup from "./SettingsGroup";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import * as Notifications from 'expo-notifications';
import settings from "@store/settings";
import { fontColor, nondescriptColor } from "@styles/variables";
import { useMutation } from "@apollo/client";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "@query/settings";
import loadingSpinner from "@store/loadingSpinner";
import session from "@store/session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { studyReminderFrequency } from "@ts/settings";
import errorMessage from "@store/toastMessage";
import { updateStatsReminderNotification, updateStudyReminderNotification } from "@utils/notifications";

const NotificationSettings = observer(function() {
	const [ permissionRequired, setPermissionRequired ] = useState(false);
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	useEffect(() => {
		(async () => {
			const status = await Notifications.getPermissionsAsync();
			if(status.status !== "granted") setPermissionRequired(true);
		})();
	}, []);

	async function requestPermission() {
		const status = await Notifications.requestPermissionsAsync();
		if(status.status === "granted") setPermissionRequired(false);
	}

	async function setStatsReminder(enabled: boolean) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { statsReminderEnabled: enabled }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to update settings ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}

		await updateStatsReminderNotification(enabled);

		loadingSpinner.dismissLoading();
	}

	async function setPhraseOfTheDayReminder(enabled: boolean) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { phraseOfTheDayReminderEnabled: enabled }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to update settings ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}

		loadingSpinner.dismissLoading();
	}

	async function setStudyReminderFrequency(frequency: studyReminderFrequency) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { studyReminderFrequency: frequency }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to update settings ${e.toString()}`);
			loadingSpinner.dismissLoading();
			return;
		}

		await updateStudyReminderNotification(frequency);

		loadingSpinner.dismissLoading();
	}

	return (
		<SettingsGroup title="Notifications & Reminders">
			<View style={styles.container}>
				{
					permissionRequired &&
					<View style={styles.grantPermission}>
						<Text style={styles.grantPermissionText}>
							In order to receive notifications you need to grant permission
						</Text>
						<View style={styles.grantPermissionButton}>
							<Button title="Grant" color="#f1574c" onPress={requestPermission} />
						</View>
					</View>
				}
				<View style={styles.option}>
					<Text style={styles.optionTitle}>
						Stats reminder
					</Text>
					<View style={styles.optionButton}>
						<Switch
							value={permissionRequired ? false : settings.settings.statsReminderEnabled}
							onChange={() => setStatsReminder(!settings.settings.statsReminderEnabled)}
							trackColor={{false: '#767577', true: '#81b0ff'}}
							thumbColor={'#f4f3f4'}
							disabled={permissionRequired}
						></Switch>
					</View>
				</View>
				<View style={styles.option}>
					<Text style={styles.optionTitle}>
						Phrase of the day
					</Text>
					<View style={styles.optionButton}>
						<Switch
							value={permissionRequired ? false : settings.settings.phraseOfTheDayReminderEnabled}
							onChange={() => setPhraseOfTheDayReminder(!settings.settings.phraseOfTheDayReminderEnabled)}
							trackColor={{false: '#767577', true: '#81b0ff'}}
							thumbColor={'#f4f3f4'}
							disabled={permissionRequired}
						></Switch>
					</View>
				</View>
				<View style={styles.radioGroup}>
					<Text style={styles.radioGroupTitle}>
						Study reminder
					</Text>
					<Text style={styles.radioGroupSubtitle}>
						How often would you like to get notified?
					</Text>
					<View style={styles.radioGroupItems}>
						<TouchableOpacity 
							style={styles.radioItem}
							onPress={() => setStudyReminderFrequency("disabled")}
						>
							<Text style={styles.radioItemTitle}>
								Never
							</Text>
							<View style={styles.radioItemButton}>
								<View style={styles.radioOuterCircle}>
									{
										settings.settings.studyReminderFrequency === "disabled" &&
										<View style={styles.radioInnerCircle} />
									}
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.radioItem}
							onPress={() => setStudyReminderFrequency("weekly-multiple")}
						>
							<Text style={styles.radioItemTitle}>
								Several times per week
							</Text>
							<View style={styles.radioItemButton}>
								<View style={styles.radioOuterCircle}>
									{
										settings.settings.studyReminderFrequency === "weekly-multiple" &&
										<View style={styles.radioInnerCircle} />
									}
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.radioItem}
							onPress={() => setStudyReminderFrequency("daily")}
						>
							<Text style={styles.radioItemTitle}>
								Daily
							</Text>
							<View style={styles.radioItemButton}>
								<View style={styles.radioOuterCircle}>
									{
										settings.settings.studyReminderFrequency === "daily" &&
										<View style={styles.radioInnerCircle} />
									}
								</View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.radioItem}
							onPress={() => setStudyReminderFrequency("daily-multiple")}
						>
							<Text style={styles.radioItemTitle}>
								Several times per day
							</Text>
							<View style={styles.radioItemButton}>
								<View style={styles.radioOuterCircle}>
									{
										settings.settings.studyReminderFrequency === "daily-multiple" &&
										<View style={styles.radioInnerCircle} />
									}
								</View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SettingsGroup>
	)
})

const styles = StyleSheet.create({
	container: {

	},
	grantPermission: {
		marginBottom: 15,
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderWidth: 2,
		borderStyle: "solid",
		borderColor: "#f1574c",
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 15,
		backgroundColor: "white"
	},
	grantPermissionText: {
		color: fontColor,
		fontSize: 15,
		lineHeight: 20,
		flexShrink: 1,
		fontStyle: "italic",
	},
	grantPermissionButton: {
		width: "25%",
		flexShrink: 0
	},
	option: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	optionTitleContainer: { //?
		flexDirection: "row",
		alignItems: "center",
		gap: 2
	},
	optionTitle: {
		fontSize: 15
	},
	optionButton: {
		justifyContent: "center",
		alignItems: "center"
	},
	radioGroup: {
		marginTop: 8
	},
	radioGroupTitle: {
		fontSize: 15,
		marginBottom: 3
	},
	radioGroupSubtitle: {
		fontSize: 13,
		color: fontColor,
		marginBottom: 10
	},
	radioGroupItems: {
		gap: 5,
		paddingHorizontal: 4
	},
	radioItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: nondescriptColor,
		borderWidth: 1,
		borderRadius: 3,
		paddingVertical: 5,
		paddingHorizontal: 8
	},
	radioItemTitle: {
		color: fontColor
	},
	radioItemButton: {
		justifyContent: "center",
		alignItems: "center"
	},
	radioOuterCircle: {
		width: 20,
		height: 20,
		borderWidth: 1,
		borderColor: nondescriptColor,
		borderStyle: "solid",
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center"
	},
	radioInnerCircle: {
		width: 12,
		height: 12,
		borderRadius: 100,
		backgroundColor: "#799dea"
	}
})

export default NotificationSettings;