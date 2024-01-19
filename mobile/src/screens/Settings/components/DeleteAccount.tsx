import { useMutation } from "@apollo/client";
import { DELETE_USER } from "@query/user";
import { fontColor } from "@styles/variables";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import session from "@store/session";
import ErrorMessage from "@components/Errors/ErrorMessage";
import { removeAuthToken } from "@utils/authToken";

const DeleteAccount = observer(function() {
	const [ deleteUser ] = useMutation(DELETE_USER);
	const [ showPasswordField, setShowPasswordField ] = useState(false);
	const [ showPassword, setShowPassword ] = useState(false);
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
			<View style={styles.inputContainer}>
					<TouchableOpacity
						style={styles.inputIconContainer}
						activeOpacity={0.7}
						onPress={() => setShowPassword(!showPassword)}
					>
						<Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="grey" />
					</TouchableOpacity>
					<TextInput
						value={password}
						onChangeText={(t) => {
							setErrorMessage("");
							setPassword(t);
						}}
						placeholder="Password"
						style={{ ...styles.input, paddingRight: 45 }}
						secureTextEntry={!showPassword}
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
					/>
			</View>
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
		width: 300,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 5,
		padding: 20,
		gap: 10,
		backgroundColor: "white"
	},
	title: {
		color: fontColor,
		fontSize: 18,
		textAlign: "center",
		fontWeight: "500"
	},
	text: {
		textAlign: "center",
		color: fontColor
	},
	inputContainer: {
		position: "relative"
	},
	inputIconContainer: {
		zIndex: 1,
		position: "absolute",
		right: 12,
		top: 10
	},
	inputIcon: {},
	input: {
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		borderRadius: 2,
		padding: 7,
		backgroundColor: "white",
		fontSize: 16,
		lineHeight: 24,
		color: fontColor
	},
	buttonContainer: {
		width: "30%",
		alignSelf: "center",
		marginTop: 4
	}
});

export default DeleteAccount;