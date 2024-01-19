import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "@query/authorization";
import { IAuthData } from "@ts-frontend/authorization";
import { observer } from "mobx-react-lite";
import { Button, Text, View } from "react-native";
import { styles } from "../styles/styles";
import { useState } from "react";
import loadingSpinner from "@store/loadingSpinner";
import SecureTextInput from "@components/Inputs/SecureTextInput";

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
			<SecureTextInput
				value={newPassword}
				onChangeText={(t: string) => {
					onError("");
					setNewPassword(t);
				}}
				placeholder="New password"
			/>
			<SecureTextInput
				value={retypePassword}
				onChangeText={(t: string) => {
					onError("");
					setRetypePassword(t);
				}}
				placeholder="Retype password"
			/>
			<View style={styles.btn}>
				<Button title="Reset" onPress={resetPasswordHandler} />
			</View>
		</View>
	)
});

export default Reset;