import { fontColor } from "@styles/variables";
import { StyleSheet, TextInput } from "react-native";

function StyledTextInput({ style = {}, ...args }) {
	return (
		<TextInput
			style={{
				...styles.input,
				...style
			}}
			{...args}
		/>
	)
}

const styles = StyleSheet.create({
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

export default StyledTextInput;