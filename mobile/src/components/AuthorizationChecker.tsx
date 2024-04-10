import { useEffect } from "react";
import { getAuthToken, setAuthToken } from "../utils/authToken";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SESSION } from "../query/authorization";
import Welcome from "../screens/Welcome/Welcome";
import { IAuthData } from "../types/authorization";
import session from "../store/session";
import { observer } from "mobx-react-lite";
import ErrorComponent from "./Errors/ErrorComponent";
import { GET_USER_SETTING } from "../query/settings";
import settings from "../store/settings";
import LoadingScreen from "./Loaders/LoadingScreen";
import { REPORT_VISIT } from "@query/stats";
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateStatsReminderNotification, updateStudyReminderNotification } from "@utils/notifications";
import { UPDATE_NOTIFICATIONS_TOKEN } from "@query/notifications";
import * as TaskManager from "expo-task-manager";
import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const AuthorizationChecker = observer(function ({ children }: any) {
	const { data, error } = useQuery(GET_SESSION, { skip: !session.data.token  || !!session.data.sid });
	const [ reportVisit ] = useMutation(REPORT_VISIT);
	const [ updateNotificationsToken ] = useMutation(UPDATE_NOTIFICATIONS_TOKEN);

	useEffect(() => {
		if(!session.data.userId) return;

		(async () => {
			try {
				const tokenSent = await AsyncStorage.getItem("notificationsTokenSent");
				if(tokenSent) return;
	
				const expoToken = await Notifications.getExpoPushTokenAsync({
					projectId: process.env.EXPO_PUBLIC_PROJECT_ID
				});

				await updateNotificationsToken({
					variables: {
						userId: session.data.userId,
						token: expoToken.data
					}
				});
			} catch (e: any) {
				console.log(`Failed to obtain and send notifications token ${e}`);
				return;
			}

			await AsyncStorage.setItem("notificationsTokenSent", "true");
		})();
	}, [session.data.userId]);

	useEffect(() => {
		(async () => {
			const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

			TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data }: any) => {
				if(!data) return;

				let date = new Date();

				if(date.getHours() > 17) {
					date.setTime(date.getTime() + 86400000);
				}
	
				date.setHours(17);
				date.setMinutes(15);

				await Notifications.scheduleNotificationAsync({
					content: {
						title: `Do you remember what does: ${JSON.parse(data.notification.data.body).value} mean?`,
						body: `It's "${JSON.parse(data.notification.data.body).translation}". Don't forget to repeat your saved phrases regularly.`
					},
					trigger: {
						date: date
					}
				});
			});

			await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
		})();
	}, [])

	useEffect(() => {
		if(!session.data.userId) return;

		(async () => {
			await reportVisit({
				variables: {
					userId: session.data.userId,
					day: Math.trunc(new Date().getTime() / 86400000) //Days from 1 jan 1970
				}
			})
		})();
	}, [session.data.userId]);

	useEffect(() => {
		session.loadingStart();
		settings.loadingStart();

		getAuthToken().then((res) => {
			if(res?.type === "google") {
				GoogleSignin.getTokens().then((oldTokens) => {
					GoogleSignin.clearCachedAccessToken(oldTokens.accessToken).then(() => {
						GoogleSignin.getTokens().then((googleTokens) => {
							session.tokenLoaded({
								...res,
								oauthToken: googleTokens.idToken
							});
						});
					});
				})
			} else {
				session.tokenLoaded(res);
			}
		}).catch((err) => {
			session.sessionError(err);
		})
	}, []);

	useEffect(() => {
		if(!data) return;
		session.dataLoaded(data.getSession);
	}, [data]);
	
	useEffect(() => {
		if(!error) return;
		session.sessionError(error);
	}, [error]);

	const { data: settingsData, error: settingsError } = useQuery(GET_USER_SETTING, { variables: { id: session.data.userId }, skip: !session.data.sid });

	useEffect(() => {
		if(!settingsData) return;
		settings.settingsLoaded(settingsData.getUserSettings);
	}, [settingsData])

	useEffect(() => {
		if(!settingsError) return;
		settings.loadError(error);
	}, [error]);

	useEffect(() => {
		if(!settingsData) return;

		const settings = settingsData.getUserSettings;
		
		(async () => {
			const status = await Notifications.getPermissionsAsync();
			if(status.status !== "granted") return;

			const statsReminderIdentifier = await AsyncStorage.getItem("statsReminderIdentifier");

			if(!!statsReminderIdentifier !== settings.settings.statsReminderEnabled) {
				await updateStatsReminderNotification(settings.settings.statsReminderEnabled);
			}

			const studyReminderFrequency = await AsyncStorage.getItem("studyReminderFrequency");

			if(studyReminderFrequency !== settings.settings.studyReminderFrequency) {
				await updateStudyReminderNotification(settings.settings.studyReminderFrequency);
			}
		})();
	}, [settingsData]);

	async function updateCredentials(data: IAuthData) {
		let savedToken;

		try {
			savedToken = await setAuthToken(data.token, data.type);
		} catch (e) {
			Alert.alert("Authorization error", "Something went wrong during authorization. Try again later");
			return;
		}

		session.dataLoaded(data);
	}

	if(session.error) {
		return <ErrorComponent message={`Failed to load session. \n ${session.error}`} />
	}

	if(settingsError) {
		return <ErrorComponent message={`Failed to load settings. \n ${settingsError}`} />
	}

	if(session.loading || (!session.loaded && !session.error)) return <LoadingScreen />

	if(!session.data.token || !session.data.sid) return <Welcome updateCredentials={updateCredentials} />

	if(settings.loading || (!settings.loaded && !settings.error)) return <LoadingScreen />

	return children;
});

export default AuthorizationChecker;