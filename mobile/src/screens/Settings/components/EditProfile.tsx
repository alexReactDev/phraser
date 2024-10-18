import Button from "@components/Button";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import { borderColor } from "@styles/variables";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
	onInput: (input: string) => void,
	placeholder?: string
}

function EditProfile({ onInput, placeholder = "Nice name" }: IProps) {
	const [ input, setInput ] = useState("");

	function inputHandler() {
		onInput(input);
		setInput("");
	}

	return (
		<View style={styles.modalBody}>
			<Text style={styles.modalTitle}>
				Profile name
			</Text>
			<StyledTextInput
				autoFocus
				value={input}
				onChangeText={(t: string) => setInput(t)}
				style={styles.modalInput}
				placeholder={placeholder}
			/>
			<Button
				title="Confirm"
				onPress={inputHandler}
				style={styles.button}
			></Button>
		</View>
	)
}

const styles = StyleSheet.create({
	modalBody: {},
	modalTitle: {
		fontSize: 18,
		marginBottom: 15
	},
	modalInput: {
		marginBottom: 15,
		paddingVertical: 9,
		paddingHorizontal: 12,
		borderRadius: 10,
		borderColor: borderColor
	},
	button: {
		alignSelf: "center"
	}
})

export default EditProfile;