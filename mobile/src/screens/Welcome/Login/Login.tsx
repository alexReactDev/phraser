import { Text, View, Button, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import { faintBlue, fontColorFaint } from "@styles/variables";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@query/authorization";
import { IAuthData } from "@ts-frontend/authorization";
import ErrorMessage from "@components/Errors/ErrorMessage";
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import { style as commonStyle } from "../style/style";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { WelcomeNavigatorParams } from "../Welcome";
import WelcomeWrapper from "../components/WelcomeWrapper";
import { StyleSheet } from "react-native";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import SecureTextInput from "@components/Inputs/SecureTextInput";
import ContinueWithGoogle from "../components/GontinueWithGoogle";

type NavigationProp = StackNavigationProp<WelcomeNavigatorParams, "Login", "WelcomeNavigator">;

const Login = observer(function({ updateCredentials }: { updateCredentials: (data: IAuthData) => void }) {
	const navigation = useNavigation<NavigationProp>();
	const passwordRef = useRef<any>(null);
	
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");

	const [ errorMessage, setErrorMessage ] = useState("");
	const [ loading, setLoading ] = useState(false);

	const [ tryLogin ] = useMutation(LOGIN);

	async function loginHandler() {
		if(loading) return;

		if(!email) {
			setErrorMessage("Email field is empty");
			return;
		}

		if(!password) {
			setErrorMessage("Password field is empty");
			return;
		}

		loadingSpinner.setLoading();
		setLoading(true);

		let data;

		try {
			data = await tryLogin({
				variables: {
					input: {
						email,
						password
					}
				}
			})
		} catch(e) {
			console.log(e);
			setErrorMessage(`Login error ${e}`);
			loadingSpinner.dismissLoading();
			setLoading(false);
			return;
		}

		updateCredentials(data?.data.login);
		loadingSpinner.dismissLoading();
		setLoading(false);
	}

	return (
		<WelcomeWrapper>
			<View style={style.subcontainer}>
				<Text style={style.subtitle}>
					Login
				</Text>
				{
					errorMessage &&
					<ErrorMessage message={errorMessage} />
				}
				<StyledTextInput
					value={email}
					onChangeText={(t: string) => {
						setErrorMessage("");
						setEmail(t);
					}}
					onBlur={() => passwordRef.current?.focus()}
					placeholder="Email"
					inputMode="email"
				/>
				<SecureTextInput
					value={password}
					onChangeText={(t: string) => {
						setErrorMessage("");
						setPassword(t);
					}}
					ref={passwordRef}
					placeholder="Password"
				/>
				<Button title="Login" onPress={loginHandler}></Button>
				<Button title="Sign up" onPress={() => navigation.navigate("Sign up")} color={faintBlue}></Button>
				<ContinueWithGoogle onError={(e) => setErrorMessage(`Google authorization failed. ${e.toString()}`)} onSuccess={updateCredentials} />
				<TouchableOpacity
					style={style.forgotButton}
					activeOpacity={0.5}
					onPress={() => navigation.navigate("Reset password")}
				>
					<Text style={style.forgotButtonText}>
						Forgot password?
					</Text>
				</TouchableOpacity>
			</View>
		</WelcomeWrapper>
	)
});

const style = {
	...commonStyle,
	...StyleSheet.create({
		forgotButton: {
			paddingLeft: 2
		},
		forgotButtonText: {
			color: fontColorFaint,
			fontSize: 15,
			fontStyle: "italic",
			textDecorationLine: "underline"
		}
	})
}

export default Login;