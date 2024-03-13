import { StyleSheet } from "react-native";
import { fontColor } from "./variables";

export default StyleSheet.create({
	input: {
		height: 120,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		borderRadius: 4,
		padding: 7,
		backgroundColor: "white",
		textAlignVertical: "top",
		fontSize: 16,
		lineHeight: 24,
		color: fontColor
	},
	inputLabel: {
		fontSize: 18,
		color: fontColor
	}
});