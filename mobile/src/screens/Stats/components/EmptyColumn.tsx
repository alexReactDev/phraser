import { StyleSheet, View } from "react-native";

function EmptyColumn({ width = 9.8 }) {
	return (
		<View style={{ ...styles.container, width }} />
	)
}

const styles = StyleSheet.create({
	container: {
		height: 200
	}
})

export default EmptyColumn;