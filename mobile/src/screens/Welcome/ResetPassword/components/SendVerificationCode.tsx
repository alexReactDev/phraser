import { useMutation } from "@apollo/client";
import { SEND_VERIFICATION_CODE } from "@query/authorization";
import { Button, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { styles } from "../styles/styles";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";

const SendVerificationCode = observer(function ({ onSend, onError }: { onSend: (email: string) => void, onError: (e: string) => void}) {
	const [ sendVerificationCode ] = useMutation(SEND_VERIFICATION_CODE);
	const [ email, setEmail ] = useState("");

	async function sendCodeHandler() {
		if(!email) {
			onError("Email field is empty");
			return;
		}

		loadingSpinner.setLoading();

		try {
			await sendVerificationCode({
				variables: {
					email
				}
			})
		} catch (e: any) {
			onError(e.toString());
			loadingSpinner.dismissLoading();
			return;
		}

		loadingSpinner.dismissLoading();
		onSend(email);
	}

	return (
		<View style={styles.subcontainer}>
			<Text style={styles.info}>
				We will send verification code to your email.
			</Text>
			<TextInput
				style={styles.input}
				inputMode="email"
				value={email}
				onChangeText={(t) => {
					onError("");
					setEmail(t);
				}}
				placeholder="Your email"
			></TextInput>
			<View style={styles.btn}>
				<Button title="Send code" onPress={sendCodeHandler} />
			</View>
		</View>
	)
});

export default SendVerificationCode;