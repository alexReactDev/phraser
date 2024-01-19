import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { useState } from "react";
import { faintBlue, fontColorFaint } from "@styles/variables";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@query/authorization";
import { IAuthData } from "@ts-frontend/authorization";
import ErrorMessage from "@components/Errors/ErrorMessage";
import { Ionicons } from '@expo/vector-icons';
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import { style as commonStyle } from "../style/style";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { WelcomeNavigatorParams } from "../Welcome";
import WelcomeWrapper from "../components/WelcomeWrapper";
import { StyleSheet } from "react-native";
import StyledTextInput from "@components/Inputs/StyledTextInput";

type NavigationProp = StackNavigationProp<WelcomeNavigatorParams, "Login", "WelcomeNavigator">;

const Login = observer(function({ updateCredentials }: { updateCredentials: (data: IAuthData) => void }) {
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);
	const navigation = useNavigation<NavigationProp>();

	const [ tryLogin ] = useMutation(LOGIN);

	async function loginHandler() {
		if(!email) {
			setErrorMessage("Email field is empty");
			return;
		}

		if(!password) {
			setErrorMessage("Password field is empty");
			return;
		}

		loadingSpinner.setLoading();

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
		}

		updateCredentials(data?.data.login);
		loadingSpinner.dismissLoading();
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
					placeholder="Email"
					inputMode="email"
				/>
				<View style={style.inputContainer}>
					<TouchableOpacity 
						style={style.inputIconContainer}
						activeOpacity={0.7}
						onPress={() => setShowPassword(!showPassword)}
					>
						<Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="grey" />
					</TouchableOpacity>
					<TextInput
						value={password}
						onChangeText={(t) => {
							setErrorMessage("");
							setPassword(t);
						}}
						placeholder="Password"
						style={{ ...style.input, paddingRight: 45 }}
						secureTextEntry={!showPassword}
						autoCapitalize="none"
						autoComplete="off"
						autoCorrect={false}
					/>
				</View>
				<Button title="Login" onPress={loginHandler}></Button>
				<Button title="Sign up" onPress={() => navigation.navigate("Sign up")} color={faintBlue}></Button>
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