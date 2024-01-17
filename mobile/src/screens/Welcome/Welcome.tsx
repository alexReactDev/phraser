import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { faintBlue, fontColor } from "../../styles/variables";
import { useMutation } from "@apollo/client";
import { LOGIN, SIGNUP } from "../../query/authorization";
import { IAuthData } from "../../types/authorization";
import ErrorMessage from "../../components/Errors/ErrorMessage";
import { Ionicons } from '@expo/vector-icons';
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";

function Welcome({ updateCredentials }: { updateCredentials: (data: IAuthData) => void }) {
	const [ showSignUp, setShowSignUp ] = useState(false);

	return (
		<View style={style.container}>
			<Text style={style.title}>Welcome!</Text>
			{
				showSignUp
				?
				<SignUp changeRoute={() => setShowSignUp(false)} updateCredentials={updateCredentials} />
				:
				<Login changeRoute={() => setShowSignUp(true)} updateCredentials={updateCredentials} />
			}
		</View>
	)
}

const Login = observer(function({ changeRoute, updateCredentials }: { changeRoute: () => void, updateCredentials: (data: IAuthData) => void }) {
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);

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
		<View style={style.subcontainer}>
			<Text style={style.subtitle}>
				Login
			</Text>
			{
				errorMessage &&
				<ErrorMessage message={errorMessage} />
			}
			<TextInput
				value={email}
				onChangeText={(t) => {
					setErrorMessage("");
					setEmail(t);
				}}
				placeholder="Email"
				inputMode="email"
				style={style.input}
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
			<Button title="Sign up" onPress={changeRoute} color={faintBlue}></Button>
		</View>
	)
})

const SignUp = observer(function({ changeRoute, updateCredentials }: { changeRoute: () => void, updateCredentials: (data: IAuthData) => void }) {
	const [ email, setEmail ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");
	const [ showPassword, setShowPassword ] = useState(false);

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
		<View style={style.subcontainer}>
			<Text style={style.subtitle}>
				Sign up
			</Text>
			{
				errorMessage &&
				<ErrorMessage message={errorMessage} />
			}
			<TextInput
				value={email}
				onChangeText={(t) => {
					setErrorMessage("");
					setEmail(t);
				}}
				placeholder="Email"
				inputMode="email"
				style={style.input}
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
			<Button title="Sign up" onPress={signUpHandler}></Button>
			<Button title="Login" onPress={changeRoute} color={faintBlue}></Button>
		</View>
	)
});

const style = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "center"
	},
	subcontainer: {
		paddingHorizontal: 20,
		gap: 12
	},
	title: {
		marginBottom: 15,
		textAlign: "center",
		fontSize: 28,
		color: fontColor
	},
	subtitle: {
		marginBottom: 5,
		textAlign: "center",
		fontSize: 21,
		color: fontColor
	},
	inputContainer: {
		position: "relative"
	},
	inputIconContainer: {
		zIndex: 1,
		position: "absolute",
		right: 12,
		top: 10
	},
	inputIcon: {

	},
	input: {
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		borderRadius: 2,
		padding: 7,
		backgroundColor: "white",
		fontSize: 16,
		lineHeight: 24,
		color: fontColor
	}
})

export default Welcome;