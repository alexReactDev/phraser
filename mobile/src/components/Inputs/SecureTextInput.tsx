import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StyledTextInput from "./StyledTextInput";
import { Ionicons } from '@expo/vector-icons';

function SecureTextInput({ containerStyle = {}, style = {}, ...args }) {
	const [ showPassword, setShowPassword ] = useState(false);

	return (
		<View style={{
			...styles.inputContainer,
			...containerStyle
		}}>
			<TouchableOpacity 
				style={styles.inputIconContainer}
				activeOpacity={0.7}
				onPress={() => setShowPassword(!showPassword)}
			>
				<Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="grey" />
			</TouchableOpacity>
			<StyledTextInput
				style={{
					...styles.input,
					...style
				}}
				secureTextEntry={!showPassword}
				autoCapitalize="none"
				autoComplete="off"
				autoCorrect={false}
				{...args}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
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
		paddingRight: 45
	}
})

export default SecureTextInput;