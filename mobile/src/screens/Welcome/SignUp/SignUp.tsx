import { Text, View } from "react-native";
import { useState, useRef } from "react";
import { faintBlue } from "@styles/variables";
import { useMutation } from "@apollo/client";
import { SIGNUP } from "@query/authorization";
import { IAuthData } from "@ts-frontend/authorization";
import ErrorMessage from "@components/Errors/ErrorMessage";
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import { style } from "../style/style";
import { StackNavigationProp } from "@react-navigation/stack";
import { WelcomeNavigatorParams } from "../Welcome";
import { useNavigation } from "@react-navigation/native";
import WelcomeWrapper from "../components/WelcomeWrapper";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import SecureTextInput from "@components/Inputs/SecureTextInput";
import Button from "@components/Button";

type NavigationProp = StackNavigationProp<WelcomeNavigatorParams, "Sign up", "WelcomeNavigator">;

const SignUp = observer(function({ updateCredentials }: { updateCredentials: (data: IAuthData) => void }) {
	const navigation = useNavigation<NavigationProp>();
	const passwordRef = useRef<any>(null);
	const retypePasswordRef = useRef<any>(null);

	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ retypePassword, setRetypePassword ] = useState("");

	const [ errorMessage, setErrorMessage ] = useState("");
	const [ loading, setLoading ] = useState(false);

	const [ trySignUp ] = useMutation(SIGNUP);

	async function signUpHandler() {
		if(loading) return;

		if(!email) {
			setErrorMessage("Email field is empty");
			return;
		}

		if(!password) {
			setErrorMessage("Password field is empty");
			return;
		}

		if(password.length < 6) {
			setErrorMessage("Password should have at least 6 characters");
			return;
		}

		if(retypePassword !== password) {
			setErrorMessage("Passwords do not match");
			return;
		}

		loadingSpinner.setLoading();
		setLoading(true);

		let res;

		try {
			res = await trySignUp({
				variables: {
					input: {
						email,
						password
					}
				}
			})
		} catch(e) {
			console.log(e);
			setErrorMessage(`Signup error. ${e}`);
			loadingSpinner.dismissLoading();
			setLoading(false);
			return;
		}

		updateCredentials(res?.data.signUp);
		loadingSpinner.dismissLoading();
		setLoading(false);
	}

	return (
		<WelcomeWrapper>
			<View style={style.subcontainer}>
				<Text style={style.subtitle}>
					Sign up
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
					onBlur={() => retypePasswordRef.current?.focus()}
					ref={passwordRef}
					placeholder="Password"
				/>
				<SecureTextInput
					value={retypePassword}
					onChangeText={(t: string) => {
						setErrorMessage("");
						setRetypePassword(t);
					}}
					ref={retypePasswordRef}
					placeholder="Retype password"
				/>
				<Button title="Sign up" onPress={signUpHandler}></Button>
				<Button title="Login" onPress={() => navigation.navigate("Login")} style={{ backgroundColor: faintBlue }}></Button>
			</View>
		</WelcomeWrapper>
	)
});

export default SignUp;