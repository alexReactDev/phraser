import { borderColor } from "@styles/variables";
import { StyleSheet, Text, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native";

interface IProps {
	onPress: () => void
	title: string,
	style?: ViewStyle
}

function Button({ onPress, title, style }: IProps) {
	return (
		<TouchableOpacity
			style={{...styles.container, ...style}}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Text style={styles.text}>
				{title}
			</Text>
		</TouchableOpacity>	
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#799dea",
		paddingVertical: 8.5,
		paddingHorizontal: 18,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: borderColor,
		elevation: 1
	},
	text: {
		fontSize: 15,
		textTransform: "uppercase",
		color: "#fff",
		fontWeight: "bold",
		letterSpacing: 0.9,
		textAlign: "center"
	}
})

export default Button;