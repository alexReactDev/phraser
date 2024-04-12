import { useMutation, useQuery } from "@apollo/client";
import ErrorComponent from "@components/Errors/ErrorComponent";
import ErrorMessage from "@components/Errors/ErrorMessage";
import SecureTextInput from "@components/Inputs/SecureTextInput";
import Loader from "@components/Loaders/Loader";
import { CANCEL_SUBSCRIPTION, GET_PREMIUM_DATA } from "@query/premium";
import { useNavigation } from "@react-navigation/native";
import loadingSpinner from "@store/loadingSpinner";
import session from "@store/session";
import toastMessage from "@store/toastMessage";
import { fontColor } from "@styles/variables";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const CancelSubscription = observer(function ({ onSuccess }: { onSuccess: () => void }) {
	const { data, error, loading } = useQuery(GET_PREMIUM_DATA, { variables: { userId: session.data.userId } });
	const [ cancelSubscription ] = useMutation(CANCEL_SUBSCRIPTION);
	const navigation = useNavigation();

	const [ showPasswordField, setShowPasswordField ] = useState(false);
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	async function cancelSubscriptionHandler() {
		loadingSpinner.setLoading();

		try {
			await cancelSubscription({
				variables: {
					userId: session.data.userId,
					password
				},
				refetchQueries: [GET_PREMIUM_DATA]
			})	
		} catch (e: any) {
			loadingSpinner.dismissLoading();
			setErrorMessage(`Failed to cancel subscription \n ${e}`);
			return;
		}

		loadingSpinner.dismissLoading();
		toastMessage.setInfoMessage("Subscription cancelled");
		onSuccess();
	}

	if(error) return <ErrorComponent message="Failed to load premium data" />
	if(loading) return <Loader />;

	const premiumData = data.getPremiumData;

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
				<Button title="Cancel" color="#f1574c" onPress={() => cancelSubscriptionHandler()} />
			</View>
		</View>	
	)

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Are you sure, you want to cancel subscription?
			</Text>
			<Text style={styles.text}>
				{
					premiumData.isTrial
					?
					`If you cancel your subscription now, your trial will be aborted immediately and you won't be charged.`
					:
					`If you cancel your subscription, it still will be valid till the end of paid period. During that time, you will be able to use all premium functionality. After paid period ends, subscription won't renew.`
				}
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

export default CancelSubscription;