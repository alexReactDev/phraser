import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { GET_COLLECTION_PHRASES, GET_PHRASE, MOVE_PHRASE, MUTATE_PHRASE } from "@query/phrases";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import settings from "@store/settings";
import { GET_PROFILE_COLLECTIONS_FOR_PHRASES } from "@query/collections";
import { ICollection } from "@ts/collections";
import LoaderModal from "@components/Loaders/LoaderModal";
import globalStyles from "@styles/phraseEditorStyles";
import { Ionicons } from '@expo/vector-icons';
import SelectWithAddBtn from "@components/SelectWithAddBtn";
import EditCollection from "../../../components/EditCollection";
import ModalWithBody from "@components/ModalWithBody";
import SaveBtn from "@components/SaveBtn";
import loadingSpinner from "@store/loadingSpinner";
import errorMessage from "@store/toastMessage";

type Props = StackScreenProps<StackNavigatorParams, "Edit", "collectionsNavigator">;

function Edit({ route, navigation }: Props) {
	const { data: { getProfileCollections: collections = [] } = {} } = useQuery(GET_PROFILE_COLLECTIONS_FOR_PHRASES, { variables: { id: settings.settings.activeProfile } });
	const { data: { getPhrase: phraseData = {} } = {}, loading: phraseLoading } = useQuery(GET_PHRASE, { variables: { id: route.params.mutateId } });

	const [ mutatePhrase ] = useMutation(MUTATE_PHRASE);
	const [ movePhrase ] = useMutation(MOVE_PHRASE);

	const [ value, setValue ] = useState("");
	const [ translation, setTranslation ] = useState("");
	const [ collection, setCollection ] = useState("");

	const [ displayModal, setDisplayModal ] = useState(false);
	const [ loading, setLoading ] = useState(false);

	const selectRef = useRef<any>(null);
	const translationInputRef = useRef<any>(null);

	const filteredCollections = collections.filter((col: ICollection) => !col.isLocked || col.id === phraseData?.collection).concat({ id: "CREATE" });

	useEffect(() => {
		if(!phraseData) return;

			setValue(phraseData.value);
			setTranslation(phraseData.translation);
			setCollection(phraseData.collection);

			selectRef?.current?.selectIndex(filteredCollections.findIndex((col: ICollection) => col.id == phraseData.collection));

			navigation.setOptions({
				title: `Edit "${phraseData.value}"`
			});
		
	}, [phraseData]);

	async function submitHandler() {
		if(loading) return;

		const data = {
			value: value.trim(),
			translation: translation.trim()
		};

		loadingSpinner.setLoading();
		setLoading(true);

		let promises = [];

		promises.push(mutatePhrase({
			variables: {
				id: route.params.mutateId,
				input: data
			}
		}));
				
		if(collection !== phraseData.collection) {
			promises.push(movePhrase({
				variables: {
					id: route.params.mutateId,
					destId: collection
				},
				refetchQueries: [{ query: GET_COLLECTION_PHRASES, variables: { id: phraseData.collection } }, { query: GET_COLLECTION_PHRASES, variables: { id: collection }}],
				update: (cache) => {
					cache.modify({
						id: `Collection:${phraseData.collection}`,
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
						id: `Collection:${collection}`,
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
			}));
		}
				
		try {
			await Promise.all(promises);
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to update phrase ${e.toString()}`);
			loadingSpinner.dismissLoading();
			setLoading(false);
			return;
		}

		loadingSpinner.dismissLoading();
		setLoading(false);
		navigation.goBack();
	}

	return (
		<View style={styles.container}>
			{
				phraseLoading &&
				<LoaderModal />
			}
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<EditCollection onReady={() => setDisplayModal(false)} />
			</ModalWithBody>
			<Text style={styles.inputLabel}>
				Phrase
			</Text>
			<TextInput
				onChangeText={setValue}
				onBlur={() => {
					translationInputRef?.current?.focus();
				}}
				value={value}
				multiline={true}
				style={styles.input}
				placeholder={phraseData.value || "Enter phrase..."}
				autoFocus
				blurOnSubmit
			/>
			<Ionicons name="arrow-down" size={24} color="gray" style={styles.icon} />
			<Text style={styles.inputLabel}>
				Translation
			</Text>
			<TextInput
				onChangeText={setTranslation}
				value={translation}
				multiline={true}
				style={styles.input}
				ref={translationInputRef}
				placeholder={phraseData.translation || "Enter translation..."}
				blurOnSubmit
			/>
			<SelectWithAddBtn
				data={filteredCollections}
				ref={selectRef}
				onSelect={(id: string) => setCollection(id)}
				onAdd={() => setDisplayModal(true)}
			></SelectWithAddBtn>
			<SaveBtn onPress={submitHandler} />
		</View>
	)
};

const styles = {
	...globalStyles,
	...StyleSheet.create({
		container: {
			paddingHorizontal: 18,
			paddingVertical: 10,
			position: "relative",
			height: "100%"
		},
		icon: {
			marginTop: 11,
			marginBottom: -19,
			alignSelf: "center"
		}
	})
}


export default Edit;