import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PHRASES_MANY, GET_COLLECTION_PHRASES, GET_PHRASE, GET_PHRASE_WITH_COLLECTION } from "../../../query/phrases";
import Loader from "../../../components/Loaders/Loader";
import ErrorComponent from "../../../components/Errors/ErrorComponent";
import CollectionPhrase from "./components/CollectionPhrase";
import { GET_COLLECTION } from "../../../query/collections";
import { FlatList } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";
import NoPhrases from "./components/NoPhrases";
import { Ionicons } from "@expo/vector-icons";
import { fontColorLight } from "@styles/variables";
import CollectionHeaderButtons from "../components/CollectionHeaderButtons";
import { IPhrase } from "@ts/phrases";
import ModalComponent from "@components/ModalComponent";
import MovePhrase from "./components/MovePhrase";

type Props = StackScreenProps<StackNavigatorParams, "Collection", "collectionsNavigator">;

function CollectionScreen({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, loading, error } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId } });
	const { data: colData, loading: colDataLoading, error: colDataError } = useQuery(GET_COLLECTION, { variables: { id: colId } });
	const [ deleteMany ] = useMutation(DELETE_PHRASES_MANY);

	const [ selectionEnabled, setSelectionEnabled ] = useState(false);
	const [ selectedItems, setSelectedItems ] = useState<string[]>([]);
	const [ displayModal, setDisplayModal ] = useState(false);

	useEffect(() => {
		if(colData)  navigation.setOptions({ title: colData.getCollection.name });
	}, [colData]);


	useEffect(() => {
		if(selectionEnabled) {
			navigation.setOptions({
				headerRight: renderSelectionInfo
			})
		} else {
			navigation.setOptions({
				headerRight: () => <CollectionHeaderButtons route={route} navigation={navigation} />
			})
		}
	}, [selectionEnabled, selectedItems])

	async function deleteManyHandler() {
		await deleteMany({
			variables: {
				ids: selectedItems
			},
			refetchQueries: [GET_COLLECTION_PHRASES, GET_PHRASE, GET_PHRASE_WITH_COLLECTION]
		});
		setSelectedItems([]);
		setSelectionEnabled(false);
	}

	function renderSelectionInfo() {
		return (
			<View style={styles.selectionContainer}>
				<Text style={styles.selectionText}>
					{`${selectedItems.length} items selected`}
				</Text>
				<TouchableOpacity
					onPress={() => {
						if(selectedItems.length === data.getCollectionPhrases.length) {
							setSelectedItems([]);
						} else {
							setSelectedItems(data.getCollectionPhrases.map((item: IPhrase) => item.id))
						}
					}}
				>
					<Ionicons name="checkmark-done" size={24} color={fontColorLight} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => selectedItems.length !== 0 && setDisplayModal(true)}
				>
					<Ionicons name="ios-return-up-forward" size={24} color={fontColorLight} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => selectedItems.length !== 0 && deleteManyHandler()}
				>
					<Ionicons name="trash-outline" size={21} color={fontColorLight} />
				</TouchableOpacity>
				<TouchableOpacity
					style={{ marginLeft: -3 }}
					onPress={() => {
						setSelectionEnabled(false);
						setSelectedItems([]);
					}}
				>
					<Ionicons name="close" size={26} color={fontColorLight} />
				</TouchableOpacity>
			</View>
		)
	}

	if(loading || colDataLoading) return <Loader />
	if(error || colDataError) return <ErrorComponent message="Failed to load collection data" />
	return (
		<>
			{
				data.getCollectionPhrases?.length === 0 && <NoPhrases />
			}
			{
				displayModal &&
				<ModalComponent visible={displayModal} onClose={() => setDisplayModal(false)}>
					<MovePhrase id={selectedItems} currentColId={colId} moveMany onSuccess={() => {
						setSelectedItems([]);
						setDisplayModal(false);
						setSelectionEnabled(false);
					}} />
				</ModalComponent>
			}
			<FlatList
				style={styles.container}
				data={data?.getCollectionPhrases}
				renderItem={({ item: phrase }) => 
					<CollectionPhrase 
						key={phrase.id} 
						phrase={phrase} 
						colId={colId} 
						navigation={navigation}
						selectionEnabled={selectionEnabled}
						isSelected={selectedItems.includes(phrase.id)}
						enableSelection={() => setSelectionEnabled(true)}
						onChange={(selected) => {
							if(selected) {
								setSelectedItems([...selectedItems, phrase.id])
							} else {
								setSelectedItems(selectedItems.filter((item: string) => item !== phrase.id))
							}
						}}
					/>
				}
				keyExtractor={(phrase) => phrase.id}
			></FlatList>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	},
	selectionContainer: {
		flexDirection: "row",
		paddingHorizontal: 10,
		gap: 10,
		alignItems: "center"
	},
	selectionText: {
		marginRight: 10,
		color: fontColorLight,
		fontSize: 16,
		fontWeight: "bold"
	}
})

export default CollectionScreen;