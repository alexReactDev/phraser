import { StackNavigationProp } from "@react-navigation/stack";
import { ICollection } from "@ts/collections";
import { StyleSheet, Text, View } from "react-native";
import { StackNavigatorParams } from "../Collections";
import { TouchableOpacity } from "react-native-gesture-handler";
import { fontColor, fontColorFaint, nondescriptColor } from "@styles/variables";
import moment from "moment";

type TNavigation = StackNavigationProp<StackNavigatorParams, "Collections", "collectionsNavigator">;

interface IProps {
	collection: ICollection,
	navigation: TNavigation
}

function CollectionRow({ collection, navigation }: IProps) {
	const lastUpdate = moment(collection.lastUpdate).fromNow();

	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.7}
			onPress={() => navigation.navigate("Collection", { colId: collection.id })}
		>
			<View style={styles.body}>
				<View style={styles.colorContainer}>
					<View style={{...styles.color, backgroundColor: collection.color }} />
				</View>
				<Text style={styles.name}>
					{collection.name}
				</Text>
			</View>
			<View style={styles.info}>
				<Text style={styles.infoRow}>
					{`${collection.meta.phrasesCount} phrases`}
				</Text>
				<Text style={styles.infoRow}>
					{`Updated ${lastUpdate}`}
				</Text>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: nondescriptColor,
		borderRadius: 5,
		padding: 12,
		backgroundColor: "#f8f8f8",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	body: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	colorContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	color: {
		width: 16,
		height: 16,
		borderRadius: 50
	},
	name: {
		fontSize: 16,
		color: fontColor
	},
	info: {
		alignItems: "flex-end"
	},
	infoRow: {
		color: fontColorFaint,
		fontSize: 12
	}
})

export default CollectionRow;