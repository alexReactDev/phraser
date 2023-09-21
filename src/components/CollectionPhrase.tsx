import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IPhrase } from "../types/phrases";
import { Ionicons } from "@expo/vector-icons";
import { fontColorFaint } from "../styles/variables";

interface IProps {
	phrase: IPhrase
}

function CollectionPhrase({ phrase }: IProps) {
	return (
		<View key={phrase.id} style={styles.container}>
			<View style={styles.info}>
				<Text style={styles.title}>
					{phrase.value}
				</Text>
				<Text style={styles.subtitle}>
					{phrase.translation}
				</Text>
			</View>
			<View style={styles.controls}>
				<TouchableOpacity
					activeOpacity={0.5}
				>
					<Ionicons name="pencil" size={24} color={"gray"} />
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.5}
				>
					<Ionicons name="trash-outline" size={24} color={"gray"} />
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 8,
		padding: 5,
		backgroundColor: "#ededede"
	},
	info: {
		flex: 1
	},
	controls: {
		width: "25%",
		flexDirection: "row",
		gap: 20,
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		marginBottom: 2,
		fontSize: 18
	},
	subtitle: {
		fontSize: 14,
		color: fontColorFaint
	}
})

export default CollectionPhrase;