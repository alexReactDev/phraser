import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontColorFaint, nondescriptColor } from "../styles/variables";

function ErrorComponent({ message = "Unknown error" }) {
	return (
		<View style={style.container}>
			<Text style={style.icon}>
				<Ionicons name="warning-outline" size={96} color={nondescriptColor} />
			</Text>
			<Text style={style.title}>
				Something went wrong
			</Text>
			<Text style={style.message}>
				{message}
			</Text>
		</View>
	)
}

const style = StyleSheet.create({
	container: {
		marginVertical: 32
	},
	icon: {
		textAlign: "center",
		marginBottom: 5
	},
	title: {
		marginBottom: 5,
		color: fontColorFaint,
		fontSize: 22,
		textAlign: "center"
	},
	message: {
		textAlign: "center",
		color: "darkgrey"
	}
})

export default ErrorComponent;