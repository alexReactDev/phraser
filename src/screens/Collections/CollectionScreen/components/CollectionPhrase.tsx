import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IPhrase } from "../../../../types/phrases";
import { Ionicons } from "@expo/vector-icons";
import { fontColorFaint } from "../../../../styles/variables";
import { useMutation } from "@apollo/client";
import { DELETE_PHRASE, GET_COLLECTION_PHRASES } from "../../../../query/phrases";

interface IProps {
	phrase: IPhrase,
	navigation: any
}

function CollectionPhrase({ phrase, navigation }: IProps) {

	const [ deletePhrase ] = useMutation(DELETE_PHRASE);
	
	function deleteHandler() {
		deletePhrase({
			variables: { id: phrase.id },
			refetchQueries: [GET_COLLECTION_PHRASES]
		})
	}

	return (
		<View style={styles.container}>
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
					onLongPress={() => navigation.navigate("Add", { mutateId: phrase.id })}
				>
					<Ionicons name="pencil" size={24} color={"gray"} />
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.5}
					onLongPress={deleteHandler}
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
		marginBottom: 12,
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