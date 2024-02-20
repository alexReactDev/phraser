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
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import ResetPassword from "./ResetPassword/ResetPassword";

export type WelcomeNavigatorParams = {
	"Sign up": undefined,
	"Login": undefined,
	"Reset password": undefined
}

const Navigator = createStackNavigator<WelcomeNavigatorParams>();

function Welcome({ updateCredentials }: { updateCredentials: (data: IAuthData) => void }) {
	return (
		<Navigator.Navigator id="WelcomeNavigator">
			<Navigator.Screen name="Login" options={{
				headerShown: false
			}}>
				{() => <Login updateCredentials={updateCredentials} />}
			</Navigator.Screen>
			<Navigator.Screen name="Sign up" options={{
				headerShown: false
			}}>
				{() => <SignUp updateCredentials={updateCredentials} />}
			</Navigator.Screen>
			<Navigator.Screen name="Reset password">
				{() => <ResetPassword updateCredentials={updateCredentials} />}
			</Navigator.Screen>
		</Navigator.Navigator>
	)
}

export default Welcome;