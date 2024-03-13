import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

function SaveBtn({ onPress }: { onPress: () => void }) {
	return (
	<TouchableOpacity
		onPress={onPress}
		style={styles.button}
	>
		<Ionicons name="save" size={24} color="gray" />
	</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		position: "absolute",
		bottom: 10,
		right: 10,
		borderRadius: 12,
		backgroundColor: "#f9f9f9",
		width: 45,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "gray",
		borderWidth: 1,
		flexDirection: "row",
		gap: 5
	}
})

export default SaveBtn;