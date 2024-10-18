import { StyleSheet } from "react-native";
import { fontColor } from "./variables";

export default StyleSheet.create({
	input: {
		height: 130,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "#cacaca",
		borderRadius: 15,
		padding: 10,
		backgroundColor: "#ffffffe5",
		textAlignVertical: "top",
		fontSize: 16,
		lineHeight: 24,
		color: fontColor
	},
	inputLabel: {
		fontSize: 17,
		color: fontColor
	}
});