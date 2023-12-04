import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

function LoaderModal() {
	return (
		<Modal
			visible
			transparent={true}
			statusBarTranslucent
		>
			<View style={styles.container}>
				<ActivityIndicator size={"large"} color={"gray"} />
			</View>
		</Modal>	
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff88"
	}
})

export default LoaderModal;