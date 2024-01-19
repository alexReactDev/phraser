import { fontColor, nondescriptColor } from "@styles/variables";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "@query/authorization";
import ErrorMessage from "@components/Errors/ErrorMessage";
import { observer } from "mobx-react-lite";
import session from "@store/session";
import loadingSpinner from "@store/loadingSpinner";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SettingsNavigatorParams } from "../Settings";
import SecureTextInput from "@components/Inputs/SecureTextInput";

type NavigationProp = StackNavigationProp<SettingsNavigatorParams, "Settings", "SettingsNavigator">;

const ChangePassword = observer(function() {
	const navigation = useNavigation<NavigationProp>();
	const [ oldPassword, setOldPassword ] = useState("");
	const [ newPassword, setNewPassword ] = useState("");
	const [ retypePassword, setRetypePassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);

	const [ errorMessage, setErrorMessage ] = useState("");

	const [ changePassword ] = useMutation(CHANGE_PASSWORD);

	async function changePasswordHandler() {
		if(!oldPassword) {
			setErrorMessage("Old password field is empty");
			return;
		}

		if(!newPassword) {
			setErrorMessage("New password field is empty");
			return;
		}

		if(!retypePassword) {
			setErrorMessage("Retype password field is empty")
			return;
		}

		if(newPassword !== retypePassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		if(oldPassword === newPassword) {
			setErrorMessage("New password and old password must not be same");
			return;
		}

		if(newPassword.length < 6) {
			setErrorMessage("Password should have at least 6 characters");
			return;
		}

		loadingSpinner.setLoading();

		try {
			await changePassword({
				variables: {
					userId: session.data.userId,
					input: {
						oldPassword,
						newPassword
					}
				}
			})
		} catch (e: any) {
			console.log(e);
			setErrorMessage(`Something went wrong. ${e}`);
			loadingSpinner.dismissLoading();
			return;
		}
		

		loadingSpinner.dismissLoading();
		navigation.navigate("Settings");
	}

	return (
		<View style={styles.container}>
			{
				errorMessage &&
				<ErrorMessage message={errorMessage} />
			}
			<Text style={styles.inputLabel}>
				Old password
			</Text>
			<SecureTextInput 
				value={oldPassword}
				onChangeText={(t: string) => {
					setErrorMessage("");
					setOldPassword(t);
				}}
				placeholder="Old password"
			/>
			<Text style={styles.inputLabel}>
				New password
			</Text>
			<SecureTextInput
			value={newPassword}
			onChangeText={(t: string) => {
				setErrorMessage("");
				setNewPassword(t);
			}}
			placeholder="New password"
			/>
			<Text style={styles.inputLabel}>
				Retype password
			</Text>
			<SecureTextInput 
			value={retypePassword}
			onChangeText={(t: string) => {
				setErrorMessage("");
				setRetypePassword(t);
			}}
			placeholder="Retype password"
			/>
			<View style={styles.btn}>
				<Button title="Change password" onPress={changePasswordHandler}></Button>
			</View>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		margin: 15,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: nondescriptColor,
		borderRadius: 10,
		padding: 15,
		gap: 12,
		backgroundColor: "white"
	},
	inputLabel: {
		marginBottom: -5,
		fontSize: 16,
		fontWeight: "bold",
		color: fontColor
	},
	btn: {
		marginTop: 4,
		alignSelf: "center"
	}
});

export default ChangePassword;