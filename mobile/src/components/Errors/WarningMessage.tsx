import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { bgColorAccent, fontColor, fontColorFaint } from "@styles/variables";

function WarningMessage({ message = "" }) {
	return (
		<View style={styles.container}>
			<View style={styles.titleContainer}>
				<Ionicons name="information-circle-outline" size={21} color={fontColor} />
				<Text style={styles.title}>
					Something went wrong
				</Text>
			</View>
			{
				message &&
				<Text style={styles.text}>
					{message.toString()}
				</Text>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		borderWidth: 1,
		borderStyle: "solid",
		borderBlockColor: "gray",
		borderRadius: 5,
		padding: 7,
		backgroundColor: bgColorAccent
	},
	titleContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8
	},
	title: {
		fontSize: 17,
		color: fontColor
	}, 
	text: {
		textAlign: "center",
		color: fontColorFaint,
		fontSize: 12.5
	}
})

export default WarningMessage;