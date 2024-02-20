import { fontColor } from "@styles/variables";
import React from "react";
import { StyleSheet, TextInput } from "react-native";

const StyledTextInput = React.forwardRef<any, any>(function({ style = {}, ...args }, ref) {
	return (
		<TextInput
			style={{
				...styles.input,
				...style
			}}
			ref={ref}
			{...args}
		/>
	)
});

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