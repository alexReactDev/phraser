import { Alert, Button, ScrollView, StyleSheet, View } from "react-native";
import ProfilesSettings from "./components/ProfilesSettings";
import LearnModeSettings from "./components/LearnModeSettings";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "../../query/user";
import session from "../../store/session";
import { removeAuthToken } from "../../utils/authToken";
import { LOGOUT } from "../../query/authorization";
import { observer } from "mobx-react-lite";
import AutoCollectionsSettings from "./components/AutoCollectionsSettings";
import AISettings from "./components/AISettings";
import errorMessage from "@store/errorMessage";
import SuggestionsSettings from "./components/SuggestionsSettings";

const Settings = observer(function() {
	const [ deleteUser ] = useMutation(DELETE_USER);
	const [ logout ] = useMutation(LOGOUT);

	async function deleteUserHandler() {
		Alert.alert("Are you sure?", "This action will delete your account permanently", [
			{
				text: "Cancel",
				style: "cancel"
			},
			{
				text: "Delete account",
				style: "destructive",
				onPress: async () => {
					try {
						await deleteUser({
							variables: {
								id: session.data.userId
							},
							context: {
								headers: {
									"Authorization": `Bearer ${session.data.token}`
								}
							}
						})
	
						await removeAuthToken();
						session.logout();
					} catch (e: any) {
						console.log(e);
						errorMessage.setErrorMessage(e.toString());
					}
				}
			}
		])
	}

	async function logoutHandler() {
		try {
			await logout({
				context: {
					headers: {
						"Authorization": `Bearer ${session.data.token}`
					}
				}
			});

			await removeAuthToken();
			session.logout();
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}
	}

	return (
		<ScrollView>
			<ProfilesSettings />
			<SuggestionsSettings />
			<AutoCollectionsSettings />
			<LearnModeSettings />
			<AISettings />
			<View style={styles.buttonsContainer}>
				<View style={styles.button}>
					<Button title="Logout" color="#ff6c6c" onPress={logoutHandler}/>
				</View>
				<View style={styles.button}>
					<Button title="Delete account" color="red" onPress={deleteUserHandler}/>
				</View>
			</View>
		</ScrollView>
	)
});

const styles = StyleSheet.create({
	buttonsContainer: {
		padding: 10,
		flexDirection: "row",
		justifyContent: "space-between"
	},
	button: {
		width: "45%"
	}
})

export default Settings;