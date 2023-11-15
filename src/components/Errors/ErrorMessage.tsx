import { StyleSheet, Text, View } from "react-native";

function ErrorMessage({ message = "" }) {
	return (
		<View style={styles.errorContainer}>
			<Text style={styles.title}>
				Error. Something went wrong
			</Text>
			<Text style={styles.message}>
				{message}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	errorContainer: {
		padding: 20,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "red",
		backgroundColor: "#fcacac88"
	},
	title: {
		textAlign: "center",
		color: "#b41111",
		fontSize: 18,
		fontWeight: "bold"
	},
	message: {
		textAlign: "center",
		color: "#9c1e1e"
	}
})

export default ErrorMessage;