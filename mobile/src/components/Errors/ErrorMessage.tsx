import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

function ErrorMessage({ message = "" }) {
	return (
		<View style={styles.errorContainer}>
			<View style={styles.titleContainer}>
				<Ionicons name="alert-circle-outline" size={21} color="#b41111" />
				<Text style={styles.title}>
					Error
				</Text>
			</View>
			<Text style={styles.message}>
				{message.toString()}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	errorContainer: {
		width: "100%",
		padding: 7,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "red",
		borderRadius: 5,
		backgroundColor: "#fcacac88"
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8
	},
	title: {
		textAlign: "center",
		color: "#b41111",
		fontSize: 17,
		fontWeight: "bold"
	},
	message: {
		textAlign: "center",
		color: "#9c1e1e",
		fontSize: 12.5
	}
})

export default ErrorMessage;