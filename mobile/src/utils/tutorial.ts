import AsyncStorage from "@react-native-async-storage/async-storage";
import toastMessage from "@store/toastMessage";

export async function skipTutorial() {
	await AsyncStorage.setItem("welcomeTutorialPassed", "true");
	await AsyncStorage.setItem("addTutorialPassed", "true");
	await AsyncStorage.setItem("collectionsTutorialPassed", "true");
	await AsyncStorage.setItem("autoCollectionsTutorialPassed", "true");
	await AsyncStorage.setItem("collectionTutorialPassed", "true");
	await AsyncStorage.setItem("cardsTutorialPassed", "true");
	await AsyncStorage.setItem("AIGeneratedTextTutorialPassed", "true");
	await AsyncStorage.setItem("descriptionTutorialPassed", "true");
	await AsyncStorage.setItem("associativePicturesTutorialPassed", "true");

	toastMessage.setInfoMessage("You can enable tutorial again anytime in the app settings");
}

export async function enableTutorial() {
	await AsyncStorage.setItem("welcomeTutorialPassed", "false");
	await AsyncStorage.setItem("addTutorialPassed", "false");
	await AsyncStorage.setItem("collectionsTutorialPassed", "false");
	await AsyncStorage.setItem("autoCollectionsTutorialPassed", "false");
	await AsyncStorage.setItem("collectionTutorialPassed", "false");
	await AsyncStorage.setItem("cardsTutorialPassed", "false");
	await AsyncStorage.setItem("AIGeneratedTextTutorialPassed", "false");
	await AsyncStorage.setItem("descriptionTutorialPassed", "false");
	await AsyncStorage.setItem("associativePicturesTutorialPassed", "false");
}