import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

function PremiumBadge({ style = {} }) {
	return (
		<View style={{...styles.badge, ...style }}>
			<Text style={styles.badgeText}>
				PREMIUM
			</Text>
			<Ionicons name="star" size={13} color="#f1b51b" />
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

export default PremiumBadge;