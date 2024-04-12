import { useMutation } from "@apollo/client";
import { DELETE_USER } from "@query/user";
import { fontColor } from "@styles/variables";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import session from "@store/session";
import ErrorMessage from "@components/Errors/ErrorMessage";
import { removeAuthToken } from "@utils/authToken";
import SecureTextInput from "@components/Inputs/SecureTextInput";

const DeleteAccount = observer(function() {
	const [ deleteUser ] = useMutation(DELETE_USER);
	const [ showPasswordField, setShowPasswordField ] = useState(false);
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	async function deleteUserHandler() {
		if(!password) setErrorMessage("Please, enter your password");
		
		loadingSpinner.setLoading();

		try {
			await deleteUser({
				variables: {
					id: session.data.userId,
					password
				}
			});
		} catch(e: any) {
			setErrorMessage(`Failed to delete account. ${e}`);
			loadingSpinner.dismissLoading();
			return;
		}

		loadingSpinner.dismissLoading();
		await removeAuthToken();
		session.logout();
	}

	if(showPasswordField) return (
		<View style={styles.container}>
			{
				errorMessage &&
				<ErrorMessage message={errorMessage} />
			}
			<Text style={styles.title}>
				Enter your password
			</Text>
				<SecureTextInput
					value={password}
					onChangeText={(t: string) => {
						setErrorMessage("");
						setPassword(t);
					}}
					placeholder="Password"
				/>
			<View style={styles.buttonContainer}>
				<Button title="Delete" color="#f1574c" onPress={() => deleteUserHandler()} />
			</View>
		</View>	
	)

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Are you sure you want to delete your account?
			</Text>
			<Text style={styles.text}>
				You won't be able to restore it
			</Text>
			<View style={styles.buttonContainer}>
				<Button title="Yes" color="#f1574c" onPress={() => setShowPasswordField(true)} />
			</View>
		</View>		
	)
});

const styles = StyleSheet.create({
	container: {
		gap: 10
	},
	title: {
		color: fontColor,
		fontSize: 18,
		textAlign: "center",
		fontWeight: "500"
	},
	text: {
		textAlign: "center",
		color: fontColor,
		lineHeight: 20
	},
	buttonContainer: {
		width: "30%",
		alignSelf: "center",
		marginTop: 4
	}
});

export default DeleteAccount;