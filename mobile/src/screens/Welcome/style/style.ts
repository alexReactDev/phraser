import { fontColor } from "@styles/variables";
import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "center"
	},
	subcontainer: {
		paddingHorizontal: 20,
		gap: 12,
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
	}
})