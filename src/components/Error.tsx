import { StyleSheet, Text, View } from "react-native";

function ErrorComponent({ message = "" }) {
	return (
		<View style={styles.errorContainer}>
			<Text>
				Error. Something went wrong
			</Text>
			<Text>
				{message}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	errorContainer: {
		padding: 20
	}
})

export default ErrorComponent;