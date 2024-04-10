import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { style as commonStyle } from "../style/style";
import { nondescriptColor } from "@styles/variables";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useMutation } from "@apollo/client";
import { CONTINUE_WITH_GOOGLE } from "@query/authorization";
import { IAuthData } from "@ts-frontend/authorization";

interface IProps {
	onError: (error: any) => void,
	onSuccess: (data: IAuthData) => void
}

function ContinueWithGoogle({ onError, onSuccess }: IProps) {
	const [ continueWithGoogle ] = useMutation(CONTINUE_WITH_GOOGLE);

	async function continueHandler() {
		let authData;

		try {
			await GoogleSignin.hasPlayServices();
			authData = await GoogleSignin.signIn();
		} catch(e: any) {
			console.log(e);
			onError(e);
			return;
		}

		let data;

		try {
			data = await continueWithGoogle({
				variables: {
					token: authData.idToken
				}
			});
		} catch (e: any) {
			console.log(e);
			onError(e);
			return;
		}

		onSuccess({
			...data.data.continueWithGoogle,
			oauthToken: authData.idToken
		});
	}

	return (
		<TouchableOpacity 
			style={styles.googleBtn}
			activeOpacity={0.7}
			onPress={() => continueHandler()}
		>
			<Text style={styles.googleBtnText}>
				Continue with Google
			</Text>
			<Ionicons name="logo-google" size={21} color="#e74c40" />
		</TouchableOpacity>
	)
};

const styles = {
	...commonStyle,
	...StyleSheet.create({
		googleBtn: {
			borderWidth: 1,
			borderStyle: "solid",
			borderColor: nondescriptColor,
			borderRadius: 5,
			padding: 7,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			gap: 10,
			backgroundColor: "#fdfdfd"
		},
		googleBtnText: {
			color: "#333",
			fontSize: 16
		}
	})
}

export default ContinueWithGoogle;