import { observer } from "mobx-react-lite";
import { styles as commonStyles } from "../styles/styles";
import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CHECK_VERIFICATION_CODE, SEND_VERIFICATION_CODE } from "@query/authorization";
import { useEffect, useState } from "react";
import loadingSpinner from "@store/loadingSpinner";
import { fontColorFaint } from "@styles/variables";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import Button from "@components/Button";

const CheckVerificationCode = observer(function({ email, onCheck, onError }: { email: string, onCheck: (code: string) => void, onError: (e: string) => void}) {
	const [ checkVerificationCode ] = useLazyQuery(CHECK_VERIFICATION_CODE);
	const [ sendVerificationCode ] = useMutation(SEND_VERIFICATION_CODE);
	const [ showResendCodeButton, setShowResendCodeButton ] = useState(false);
	const [ code, setCode ] = useState("");
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		if(showResendCodeButton) return;

		const timer = setTimeout(() => setShowResendCodeButton(true), 1000 * 60);

		return () => clearInterval(timer);
	}, [showResendCodeButton]);
	
	async function checkCodeHandler() {
		if(loading) return;

		if(!code) {
			onError("Please, provide verification code");
			return;
		}

		loadingSpinner.setLoading();
		setLoading(true);

		try {
			const res = await checkVerificationCode({
				variables: {
					code,
					email
				}
			});
			if(res.error) throw res.error;
		} catch(e: any) {
			onError(e.toString());
			loadingSpinner.dismissLoading();
			setLoading(false);
			return;
		}

		loadingSpinner.dismissLoading();
		setLoading(false);
		onCheck(code);
	}

	async function resendCodeHandler() {
		setShowResendCodeButton(false);
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
	}

	return (
		<View style={styles.subcontainer}>
			<Text style={styles.info}>
				We've sent verification code to your email. Note, that message delivery can take some time, and don't forget to check your spam folder.
			</Text>
			<StyledTextInput
				style={styles.codeInput}
				inputMode="numeric"
				value={code}
				onChangeText={(t: string) => {
					onError("");
					setCode(t);
				}}
				placeholder="Code"
				autoFocus
			/>
			<View style={styles.btn}>
				<Button title="Verify" onPress={checkCodeHandler} />
			</View>
			{
				showResendCodeButton &&
				<TouchableOpacity
					style={styles.resendCodeButton}
					activeOpacity={0.5}
					onPress={resendCodeHandler}
				>
					<Text style={styles.resendCodeButtonText}>
						Didn't get code?
					</Text>
				</TouchableOpacity>
			}
		</View>
	)
});

const styles = {
	...commonStyles,
	...StyleSheet.create({
		codeInput: {
			width: "45%", 
			alignSelf: "center", 
			textAlign: "center",
			fontSize: 18
		},
		resendCodeButton: {
			alignSelf: "center"
		},
		resendCodeButtonText: {
			color: fontColorFaint,
			fontSize: 16,
			fontStyle: "italic",
			textDecorationLine: "underline"	
		}
	})
}

export default CheckVerificationCode;