import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StyledTextInput from "./StyledTextInput";
import { Ionicons } from '@expo/vector-icons';

const SecureTextInput = React.forwardRef<any, any>(function ({ containerStyle = {}, style = {}, ...args }, ref) {
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
				<Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#888" />
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
				ref={ref}
				{...args}
			/>
		</View>
	)
});

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