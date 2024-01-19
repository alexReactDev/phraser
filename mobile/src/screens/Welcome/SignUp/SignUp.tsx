import { Text, View, Button } from "react-native";
import { useState } from "react";
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

type NavigationProp = StackNavigationProp<WelcomeNavigatorParams, "Sign up", "WelcomeNavigator">;

const SignUp = observer(function({ updateCredentials }: { updateCredentials: (data: IAuthData) => void }) {
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");
	const navigation = useNavigation<NavigationProp>();

	const [ trySignUp ] = useMutation(SIGNUP);

	async function signUpHandler() {
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

		loadingSpinner.setLoading();

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
		}

		updateCredentials(res?.data.signUp);
		loadingSpinner.dismissLoading();
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
					placeholder="Email"
					inputMode="email"
				/>
				<SecureTextInput
					value={password}
					onChangeText={(t: string) => {
						setErrorMessage("");
						setPassword(t);
					}}
					placeholder="Password"
				/>
				<Button title="Sign up" onPress={signUpHandler}></Button>
				<Button title="Login" onPress={() => navigation.navigate("Login")} color={faintBlue}></Button>
			</View>
		</WelcomeWrapper>
	)
});

export default SignUp;