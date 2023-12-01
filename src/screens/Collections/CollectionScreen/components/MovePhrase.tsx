import { useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE_COLLECTIONS_FOR_PHRASES } from "@query/collections";
import settings from "@store/settings";
import { Button, StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import { ICollection } from "@ts/collections";
import { useState } from "react";
import { GET_COLLECTION_PHRASES, MOVE_PHRASE, MOVE_PHRASES_MANY } from "@query/phrases";

interface IProps {
	id: string | string[],
	currentColId: string,
	moveMany?: boolean,
	onSuccess?: () => void,
	onError?: () => void
}

function MovePhrase({ id, currentColId, moveMany = false, onSuccess }: IProps) {
	const { data: { getProfileCollections: collections = [] } = {} } = useQuery(GET_PROFILE_COLLECTIONS_FOR_PHRASES, { variables: { id: settings.settings.activeProfile } });
	const [ selectedId, setSelected ] = useState();
	const [ movePhrase ] = useMutation(MOVE_PHRASE);
	const [ movePhrasesMany ] = useMutation(MOVE_PHRASES_MANY);

	async function moveHandler() {
		if(moveMany) {
			await movePhrasesMany({
				variables: {
					ids: id,
					destId: selectedId
				},
				refetchQueries: [GET_COLLECTION_PHRASES]
			})
		} else {
			await movePhrase({
				variables: {
					id,
					destId: selectedId
				},
				refetchQueries: [GET_COLLECTION_PHRASES]
			})
		}

		onSuccess && onSuccess();
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{
					moveMany ? "Move phrases" : "Move phrase"
				}
			</Text>
			<SelectDropdown
				data={collections.filter((col: Partial<ICollection>) => !col.isLocked && !(col.id === currentColId))}
				onSelect={(selectedItem) => setSelected(selectedItem.id)}
				rowTextForSelection={(item) => item.name}
				buttonTextAfterSelection={(item) => item.name}
				defaultButtonText="Select collection"
				buttonStyle={styles.select}
				buttonTextStyle={styles.selectText}
				renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color="gray" />}

			></SelectDropdown>
			<View
				style={styles.button}
			>
				<Button
					title={"Move"}
					onPress={moveHandler}
				></Button>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: 300,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		padding: 20,
		gap: 20,
		position: "relative",
		backgroundColor: "white"
	},
	title: {
		fontSize: 18
	},
	select: {
		width: "100%",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 2
	},
	selectText: {
		color: "gray"
	},
	button: {
		alignSelf: "center",
		width: "30%"
	}
})


export default MovePhrase;