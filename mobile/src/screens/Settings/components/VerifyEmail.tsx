import { useMutation } from "@apollo/client";
import { VERIFY_EMAIL } from "@query/authorization";
import session from "@store/session";
import { fontColor } from "@styles/variables";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const VerifyEmail = observer(function() {
	const [ verifyEmail ] = useMutation(VERIFY_EMAIL);
	const [ verificationSent, setVerificationSent ] = useState(false);
	const [ showResendButton, setShowResendButton ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ errorMessage, setErrorMessage ] = useState("");

	useEffect(() => {
		if(!verificationSent || showResendButton) return;

		const timer = setTimeout(() => setShowResendButton(true), 1000 * 30); //30 seconds
		return () => clearTimeout(timer);
	}, [ showResendButton, verificationSent ]);

	async function verifyEmailHandler() {
		setLoading(true);

		try {
			await verifyEmail({
				variables: {
					userId: session.data.userId
				}
			})
		} catch (e: any) {
			setErrorMessage("Something went wrong. Try again later");
			setLoading(false);
			return;
		}

		setLoading(false);
		!verificationSent && setVerificationSent(true);
		showResendButton && setShowResendButton(false);
	}

	if(!verificationSent) return (
		<View style={styles.container}>
			<Text style={styles.text}>
				{
					errorMessage || "Please, verify your email"
				}
			</Text>
			{
				loading
				?
				<ActivityIndicator size="small" color="grey" />
				:
				<View style={styles.buttonContainer}>
					<Button title="Verify" onPress={verifyEmailHandler} color="#f1574c" />
				</View>
			}
		</View>
	)


	console.log(showResendButton);

	return (
		<View style={styles.container}>
			<Text style={styles.text}>
				{
					errorMessage || "We've sent you verification link. Don't forget to check spam folder"
				}
			</Text>
			{
				loading
				?
				<ActivityIndicator size="small" color="grey" />
				:
				<TouchableOpacity 
					style={styles.buttonContainer}
					activeOpacity={0.5}
					onPress={verifyEmailHandler}
				>
					{
						showResendButton &&
						<Text style={styles.buttonText}>
							Didn't get mail?
						</Text>
					}
				</TouchableOpacity>
			}
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		margin: 10,
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderWidth: 2,
		borderStyle: "solid",
		borderColor: "#f1574c",
		borderRadius: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 15,
		backgroundColor: "white"
	},
	text: {
		paddingVertical: 7,
		color: fontColor,
		fontSize: 15,
		lineHeight: 20,
		flexShrink: 1,
		fontStyle: "italic",
	},
	buttonContainer: {
		width: "30%",
		flexShrink: 0
	},
	buttonText: {
		color: "#9c2323",
		textAlign: "center",
		lineHeight: 18,
		textDecorationLine: "underline",
		fontStyle: "italic"
	}
})

export default VerifyEmail;