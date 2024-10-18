import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

function SaveBtn({ onPress }: { onPress: () => void }) {
	return (
	<TouchableOpacity
		onPress={onPress}
		style={styles.button}
		activeOpacity={0.8}
	>
		<Ionicons name="save" size={26} color="#888" />
	</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		position: "absolute",
		bottom: 18,
		right: 12,
		borderRadius: 15,
		backgroundColor: "#f9f9f9ee",
		width: 47,
		height: 47,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "#aaa",
		borderWidth: 1,
		flexDirection: "row",
		gap: 5
	}
})

export default SaveBtn;