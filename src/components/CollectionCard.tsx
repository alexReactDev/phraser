import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ICollection } from "../types/collections";
import moment from "moment";
import { fontColor, fontColorFaint, fontColorFaintLight, fontColorLight } from "../styles/variables";

interface IProps {
	collection: ICollection,
	navigation: any
}

function CollectionCard({ collection, navigation }: IProps) {
	//@ts-ignore moment accepts timestamps (bigint type)
	const lastUpdate = moment(collection.lastUpdate).fromNow();

	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("Collection", { colId: collection.id})}
			activeOpacity={0.8}
			style={{backgroundColor: collection.color, ...styles.container}}
		>
			<View>
				<View>
					<Text style={styles.title}>
						{collection.name}
					</Text>
					<Text style={styles.subtitle}>
						Words: {collection.meta.phrasesCount}
					</Text>
				</View>
				<View>
					<Text style={styles.bottomNote}>
						Last update: {lastUpdate}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		width: "47%",
		height: 165,
		justifyContent: "space-between",
		borderRadius: 10
	},
	title: {
		marginBottom: 2,
		fontSize: 18,
		color: fontColorLight
	},
	subtitle: {
		color: fontColorFaintLight
	},
	bottomNote: {
		color: fontColorFaintLight,
		fontSize: 11
	}
})

export default CollectionCard;