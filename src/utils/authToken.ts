import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAuthToken() {
	let token;

	try {
		token = await AsyncStorage.getItem("token");
	} catch (e) {
		console.log(e);
	}

	if(token) return token;

	return "";
}

export async function setAuthToken(token: string) {
	let result;

	try {
		await AsyncStorage.setItem("token", token);
		result = await AsyncStorage.getItem("token");
	} catch (e) {
		console.log(e);
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