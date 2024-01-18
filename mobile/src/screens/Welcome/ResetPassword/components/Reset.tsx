import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "@query/authorization";
import { IAuthData } from "@ts-frontend/authorization";
import { observer } from "mobx-react-lite";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import loadingSpinner from "@store/loadingSpinner";

interface IProps {
	email: string, 
	code: string,
	onError: (e: string) => void,
	updateCredentials: (data: IAuthData) => void
}

const Reset = observer(function({ email, code, onError, updateCredentials }: IProps) {
	const [ resetPassword ] = useMutation(RESET_PASSWORD);
	const [ newPassword, setNewPassword ] = useState("");
	const [ retypePassword, setRetypePassword ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);

	async function resetPasswordHandler() {
		if(!newPassword) {
			onError("Password field is empty");
			return;
		}

		if(!retypePassword) {
			onError("Retype password field is empty");
			return;
		}

		if(newPassword !== retypePassword) {
			onError("Passwords do not match");
			return;
		}

		if(newPassword.length < 6) {
			onError("Password should have at least 6 characters");
			return;
		}

		loadingSpinner.setLoading();

		let credentials;

		try {
			const res = await resetPassword({
				variables: {
					input: {
						code,
						email,
						newPassword
					}
				}
			});
			
			credentials = res?.data.resetPassword;
		} catch(e: any) {
			onError(e.toString());
			loadingSpinner.dismissLoading();
			return;
		}

		updateCredentials(credentials);
		loadingSpinner.dismissLoading();
	}

	return (
		<View style={styles.subcontainer}>
			<Text style={styles.info}>
				Please, create new password
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
						value={newPassword}
						onChangeText={(t) => {
							onError("");
							setNewPassword(t);
						}}
						placeholder="New password"
						style={{ ...styles.input, paddingRight: 45 }}
						secureTextEntry={!showPassword}
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
					/>
			</View>
			<View style={styles.inputContainer}>
				<TouchableOpacity
					style={styles.inputIconContainer}
					activeOpacity={0.7}
					onPress={() => setShowPassword(!showPassword)}
				>
					<Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="grey" />
				</TouchableOpacity>
				<TextInput
					value={retypePassword}
					onChangeText={(t) => {
						onError("");
						setRetypePassword(t);
					}}
					placeholder="Retype password"
					style={{ ...styles.input, paddingRight: 45 }}
					secureTextEntry={!showPassword}
					autoCapitalize="none"
					autoComplete="off"
					autoCorrect={false}
				/>
			</View>
			<View style={styles.btn}>
				<Button title="Reset" onPress={resetPasswordHandler} />
			</View>
		</View>
	)
});

export default Reset;