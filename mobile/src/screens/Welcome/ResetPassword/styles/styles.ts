import { fontColor } from "@styles/variables";
import { style as commonStyles } from "../../style/style";
import { StyleSheet } from "react-native";

export const styles = {
	...commonStyles,
	...StyleSheet.create({
		container: {
			paddingVertical: 20,
			paddingHorizontal: 25
		},
		subcontainer: {
			gap: 15
		},
		title: {
			marginVertical: 8,
			textAlign: "center",
			color: fontColor,
			fontSize: 21
		},
		info: {
			textAlign: "center",
			fontStyle: "italic"
		},
		btn: {
			alignSelf: "center",
			width: "30%"
		}
	})
}