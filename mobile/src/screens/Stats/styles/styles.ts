import { fontColor } from "@styles/variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
	container: {
		marginHorizontal: 10
	},
	title: {
		color: fontColor,
		fontSize: 21,
		marginBottom: 8
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	rowName: {
		width: "50%",
		color: fontColor,
		fontSize: 15
	},
	rowValue: {
		maxWidth: "50%",
		minWidth: "22.5%",
		textAlign: "center",
		color: fontColor,
		fontSize: 15,
		lineHeight: 21
	}
})