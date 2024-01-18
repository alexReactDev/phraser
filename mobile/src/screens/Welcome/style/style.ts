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
	},
	inputContainer: {
		position: "relative"
	},
	inputIconContainer: {
		zIndex: 1,
		position: "absolute",
		right: 12,
		top: 10
	},
	inputIcon: {},
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