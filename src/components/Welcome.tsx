import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { faintBlue, fontColor } from "../styles/variables";
import { useMutation } from "@apollo/client";
import { LOGIN, SIGNUP } from "../query/authorization";
import { IAuthData } from "../types/authorization";

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

function Login({ changeRoute, updateCredentials }: { changeRoute: () => void, updateCredentials: (data: IAuthData) => void }) {
	const [ login, setLogin ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	const [ tryLogin ] = useMutation(LOGIN);

	async function loginHandler() {
		if(!login || !password) return;

		let data;

		try {
			data = await tryLogin({
				variables: {
					input: {
						login,
						password
					}
				}
			})
		} catch(e) {
			console.log(e);
			setErrorMessage(`Login error ${e}`);
		}

		updateCredentials(data?.data.login);
	}

	return (
		<View style={style.subcontainer}>
			<Text style={style.subtitle}>
				Login
			</Text>
			{
				errorMessage &&
				<Text>
					{errorMessage}
				</Text>
			}
			<TextInput
				value={login}
				onChangeText={setLogin}
				placeholder="Login"
				style={style.input}
			/>
			<TextInput
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
				style={style.input}
			/>
			<Button title="Login" onPress={loginHandler}></Button>
			<Button title="Sign up" onPress={changeRoute} color={faintBlue}></Button>
		</View>
	)
}

function SignUp({ changeRoute, updateCredentials }: { changeRoute: () => void, updateCredentials: (data: IAuthData) => void }) {
	const [ login, setLogin ] = useState("");
	const [ password, setPassword ] = useState("");
	const [ name, setName ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	const [ trySignUp ] = useMutation(SIGNUP);

	async function signUpHandler() {
		if(!login || !password || !name) return;

		let data;

		try {
			data = await trySignUp({
				variables: {
					input: {
						login,
						password,
						name
					}
				}
			})
		} catch(e) {
			console.log(e);
			setErrorMessage(`Signup error ${e}`);
		}

		updateCredentials(data?.data.login);
	}

	return (
		<View style={style.subcontainer}>
			<Text style={style.subtitle}>
				Sign up
			</Text>
			{
				errorMessage &&
				<Text>
					{errorMessage}
				</Text>
			}
			<TextInput
				value={name}
				onChangeText={setName}
				placeholder="Visible name"
				style={style.input}
			/>
			<TextInput
				value={login}
				onChangeText={setLogin}
				placeholder="Login"
				style={style.input}
			/>
			<TextInput
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
				style={style.input}
			/>
			<Button title="Sign up" onPress={signUpHandler}></Button>
			<Button title="Login" onPress={changeRoute} color={faintBlue}></Button>
		</View>
	)
}

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