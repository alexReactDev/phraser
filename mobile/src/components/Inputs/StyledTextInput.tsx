import { borderColor, fontColor } from "@styles/variables";
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
		borderColor: borderColor,
		borderRadius: 10,
		paddingVertical: 7,
		paddingHorizontal: 10,
		backgroundColor: "white",
		fontSize: 16,
		lineHeight: 24,
		color: fontColor
	}
})

export default StyledTextInput;