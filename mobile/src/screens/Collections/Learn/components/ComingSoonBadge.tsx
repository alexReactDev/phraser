import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

function ComingSoonBadge({ style = {} }) {
	return (
		<View style={{...styles.badge, ...style }}>
			<Text style={styles.badgeText}>
				COMING SOON
			</Text>
			<Ionicons name="time" size={13} color="#f2f2f2" />
		</View>
	)
}

const styles = StyleSheet.create({
	badge: {
		position: "absolute",
		height: 17,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		borderTopLeftRadius: 5,
		borderBottomRightRadius: 5,
		paddingHorizontal: 3,
		backgroundColor: "#799dea"
	},
	badgeText: {
		color: "white",
		fontSize: 10,
		fontWeight: "bold"
	}
});

export default ComingSoonBadge;