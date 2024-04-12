import { fontColor } from "@styles/variables";
import SettingsGroup from "./SettingsGroup";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { enableTutorial } from "@utils/tutorial";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigatorParams } from "../../../Navigation";

type NavigationProp = BottomTabNavigationProp<NavigatorParams, "Settings", "MainNavigator">

function OtherSettings() {
	const navigation = useNavigation<NavigationProp>();

	async function enableTutorialHandler() {
		await enableTutorial();
		navigation.navigate("Add");
	}

	return (
		<SettingsGroup title="Other">
			<View style={styles.container}>
				<TouchableOpacity style={styles.option}
					activeOpacity={0.5}
					onPress={enableTutorialHandler}
				>
					<Text style={styles.optionText}>
						Tutorial
					</Text>
				</TouchableOpacity>
			</View>
		</SettingsGroup>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: -1
	},
	option: {
		borderWidth: 1,
		borderColor: "#eee",
		borderStyle: "solid",
		borderRadius: 2,
		padding: 9
	},
	optionText: {
		fontSize: 15,
		color: fontColor
	}
});

export default OtherSettings;