import { ActivityIndicator, StyleSheet, View } from "react-native";

function Loader() {
	return (
		<View style={styles.loadingContainer}>
			<ActivityIndicator size={"large"} color={"gray"}></ActivityIndicator>
		</View>
	)
}

const styles = StyleSheet.create({
	loadingContainer: {
		padding: 20
	}
})

export default Loader;