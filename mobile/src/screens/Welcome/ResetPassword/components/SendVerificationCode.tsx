import { useMutation } from "@apollo/client";
import { SEND_VERIFICATION_CODE } from "@query/authorization";
import { Text, View } from "react-native";
import { styles } from "../styles/styles";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import Button from "@components/Button";

const SendVerificationCode = observer(function ({ onSend, onError }: { onSend: (email: string) => void, onError: (e: string) => void}) {
	const [ sendVerificationCode ] = useMutation(SEND_VERIFICATION_CODE);
	const [ email, setEmail ] = useState("");
	const [ loading, setLoading ] = useState(false);

	async function sendCodeHandler() {
		if(loading) return;

		if(!email) {
			onError("Email field is empty");
			return;
		}

		loadingSpinner.setLoading();
		setLoading(true);

		try {
			await sendVerificationCode({
				variables: {
					email
				}
			})
		} catch (e: any) {
			onError(e.toString());
			loadingSpinner.dismissLoading();
			setLoading(false);
			return;
		}

		loadingSpinner.dismissLoading();
		setLoading(false);
		onSend(email);
	}

	return (
		<View style={styles.subcontainer}>
			<Text style={styles.info}>
				We will send verification code to your email.
			</Text>
			<StyledTextInput
				inputMode="email"
				value={email}
				onChangeText={(t: string) => {
					onError("");
					setEmail(t);
				}}
				placeholder="Your email"
				autoFocus
			/>
			<View style={styles.btn}>
				<Button 
					title="Send code" 
					onPress={sendCodeHandler}
				/>
			</View>
		</View>
	)
});

export default SendVerificationCode;