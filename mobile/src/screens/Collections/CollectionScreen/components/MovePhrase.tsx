import { useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE_COLLECTIONS_FOR_PHRASES } from "@query/collections";
import settings from "@store/settings";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { ICollection } from "@ts/collections";
import { useState } from "react";
import { GET_COLLECTION_PHRASES, MOVE_PHRASE, MOVE_PHRASES_MANY } from "@query/phrases";
import { observer } from "mobx-react-lite";
import errorMessage from "@store/toastMessage";
import loadingSpinner from "@store/loadingSpinner";
import Button from "@components/Button";
import StyledSelect from "@components/StyledSelect";

interface IProps {
	id: string | string[],
	currentColId: string,
	moveMany?: boolean,
	onSuccess?: () => void,
	onError?: () => void
}

const MovePhrase = observer(function({ id, currentColId, moveMany = false, onSuccess }: IProps) {
	const { data: { getProfileCollections: collections = [] } = {} } = useQuery(GET_PROFILE_COLLECTIONS_FOR_PHRASES, { variables: { id: settings.settings.activeProfile } });
	const [ selectedId, setSelected ] = useState();
	const [ movePhrase ] = useMutation(MOVE_PHRASE);
	const [ movePhrasesMany ] = useMutation(MOVE_PHRASES_MANY);

	async function moveHandler() {
		loadingSpinner.setLoading();

		if(moveMany) {
			try {
				await movePhrasesMany({
					variables: {
						ids: id,
						destId: selectedId
					},
					refetchQueries: [{
						query: GET_COLLECTION_PHRASES,
						variables: { id: currentColId }
					}],
					update: (cache) => {
						cache.evict({ fieldName: "getCollectionPhrases", args: { id: selectedId } });
						cache.modify({
							id: `Collection:${currentColId}`,
							fields: {
								lastUpdate: () => new Date().getTime(),
								//@ts-ignore Meta is not a reference
								meta: (oldMeta: ICollectionMeta) => ({
									...oldMeta,
									phrasesCount: oldMeta.phrasesCount - id.length
								})
							}
						});
						cache.modify({
							id: `Collection:${selectedId}`,
							fields: {
								lastUpdate: () => new Date().getTime(),
								//@ts-ignore Meta is not a reference
								meta: (oldMeta: ICollectionMeta) => ({
									...oldMeta,
									phrasesCount: oldMeta.phrasesCount + id.length
								})
							}
						})
					}
				})
			} catch (e: any) {
				console.log(e);
				errorMessage.setErrorMessage(`Failed to move phrases ${e.toString()}`);
			}
		} else {
			try {
				await movePhrase({
					variables: {
						id,
						destId: selectedId
					},
					refetchQueries: [{
						query: GET_COLLECTION_PHRASES,
						variables: { id: currentColId }
					}],
					update: (cache) => {
						cache.evict({ fieldName: "getCollectionPhrases", args: { id: selectedId } });
						cache.modify({
							id: `Collection:${currentColId}`,
							fields: {
								lastUpdate: () => new Date().getTime(),
								//@ts-ignore Meta is not a reference
								meta: (oldMeta: ICollectionMeta) => ({
									...oldMeta,
									phrasesCount: oldMeta.phrasesCount - 1
								})
							}
						});
						cache.modify({
							id: `Collection:${selectedId}`,
							fields: {
								lastUpdate: () => new Date().getTime(),
								//@ts-ignore Meta is not a reference
								meta: (oldMeta: ICollectionMeta) => ({
									...oldMeta,
									phrasesCount: oldMeta.phrasesCount + 1
								})
							}
						});
					}
				})
			} catch (e: any) {
				console.log(e);
				errorMessage.setErrorMessage(`Failed to move phrase ${e.toString()}`);
			}
		}

		onSuccess && onSuccess();
		loadingSpinner.dismissLoading();
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{
					moveMany ? "Move phrases" : "Move phrase"
				}
			</Text>
			<StyledSelect
				data={collections.filter((col: Partial<ICollection>) => !col.isLocked && !(col.id === currentColId))}
				onSelect={(selectedItem) => setSelected(selectedItem.id)}
				rowTextForSelection={(item) => item.name}
				buttonTextAfterSelection={(item) => item.name}
				defaultButtonText="Select collection"
				buttonStyle={styles.select}
				buttonTextStyle={styles.selectText}
				renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color="gray" />}

			></StyledSelect>
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
});

const styles = StyleSheet.create({
	container: {
		gap: 20
	},
	title: {
		fontSize: 18
	},
	select: {
		width: "100%",
		borderStyle: "solid"
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