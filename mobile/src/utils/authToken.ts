import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthType } from '@ts/authorization';

export async function getAuthToken() {
	const token = await AsyncStorage.getItem("token");
	const type =  await AsyncStorage.getItem("authType");

	if(token && type) return {
		token,
		type: type as AuthType
	};

	return null;
}

export async function setAuthToken(token: string, type: AuthType = "default") {
	await AsyncStorage.setItem("token", token);
	await AsyncStorage.setItem("authType", type);

	const savedToken = await AsyncStorage.getItem("token");
	const authType = await AsyncStorage.getItem("authType");

	const result = {
		token: savedToken,
		type: authType
	}

	return result;
}

export async function removeAuthToken() {
	try {
		await AsyncStorage.removeItem("token");
	} catch (e) {
		console.log(e);
	}
}