import { removeAuthToken } from "@utils/authToken";
import SettingsGroup from "./SettingsGroup";
import session from "@store/session";
import errorMessage from "@store/errorMessage";
import { useMutation } from "@apollo/client";
import { LOGOUT } from "@query/authorization";
import { DELETE_USER } from "@query/user";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { SettingsNavigatorParams } from "../Settings";
import { StackNavigationProp } from "@react-navigation/stack";
import { fontColor } from "@styles/variables";

type NavigationProp = StackNavigationProp<SettingsNavigatorParams, "Settings", "SettingsNavigator">

const AccountManagement = observer(function () {
	const [ deleteUser ] = useMutation(DELETE_USER);
	const [ logout ] = useMutation(LOGOUT);
	const navigation = useNavigation<NavigationProp>();

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
		<SettingsGroup title="Account management">
			<View style={styles.container}>
				<TouchableOpacity style={styles.option}
					activeOpacity={0.5}
					onPress={() => navigation.navigate("Change password")}
				>
					<Text style={styles.optionText}>
						Change password
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option}
					activeOpacity={0.5}
					onPress={logoutHandler}
				>
					<Text style={{...styles.optionText, color: "#9c2323"}}>
						Log out
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option}
					activeOpacity={0.5}
					onPress={deleteUserHandler}
				>
					<Text style={{...styles.optionText, color: "#9c2323"}}>
						Delete account
					</Text>
				</TouchableOpacity>
			</View>
		</SettingsGroup>
	)
});

const styles = StyleSheet.create({
	container: {
		gap: -1
	},
	option: {
		borderWidth: 1,
		borderColor: "#eee",
		borderStyle: "solid",
		borderRadius: 2,
		padding: 9
	},
	optionText: {
		fontSize: 15,
		color: fontColor
	}
})

export default AccountManagement;