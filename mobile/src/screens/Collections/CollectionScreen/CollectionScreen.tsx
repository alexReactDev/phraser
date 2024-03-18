import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_PHRASES_MANY, GET_COLLECTION_PHRASES, GET_PHRASE } from "../../../query/phrases";
import Loader from "../../../components/Loaders/Loader";
import ErrorComponent from "../../../components/Errors/ErrorComponent";
import CollectionPhrase from "../components/CollectionPhrase";
import { GET_COLLECTION } from "../../../query/collections";
import { FlatList } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";
import NoPhrases from "./components/NoPhrases";
import { Ionicons } from "@expo/vector-icons";
import { fontColorLight } from "@styles/variables";
import CollectionHeaderButtons from "../components/CollectionHeaderButtons";
import { IPhrase } from "@ts/phrases";
import MovePhrase from "./components/MovePhrase";
import { observer } from "mobx-react-lite";
import errorMessage from "@store/errorMessage";
import loadingSpinner from "@store/loadingSpinner";
import LearnButton from "./components/LearnButton";
import ModalWithBody from "@components/ModalWithBody";
import Search from "@components/Search";
import SearchResults from "./components/SearchResults";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CollectionTutorial from "./components/CollectionTutorial";

type Props = StackScreenProps<StackNavigatorParams, "Collection", "collectionsNavigator">;

const CollectionScreen = observer(function({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, loading, error } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId } });
	const { data: colData, loading: colDataLoading, error: colDataError } = useQuery(GET_COLLECTION, { variables: { id: colId } });
	const [ deleteMany ] = useMutation(DELETE_PHRASES_MANY);

	const [ selectionEnabled, setSelectionEnabled ] = useState(false);
	const [ selectedItems, setSelectedItems ] = useState<string[]>([]);
	const [ displayModal, setDisplayModal ] = useState(false);

	const [ showTutorial, setShowTutorial ] = useState(false);

	const [ searchQuery, setSearchQuery ] = useState("");

	useEffect(() => {
		if(colData)  navigation.setOptions({ title: colData.getCollection.name });
	}, [colData]);

	useEffect(() => {
		(async () => {
			const tutorialPassed = await AsyncStorage.getItem("collectionTutorialPassed");
			if(tutorialPassed !== "true") setShowTutorial(true);
		})();
	}, [])

	useEffect(() => {
		if(!colData) return; //First render precaution

		if(selectionEnabled) {
			navigation.setOptions({
				headerRight: renderSelectionInfo,
				title: ""
			})
		} else {
			navigation.setOptions({
				headerRight: () => <CollectionHeaderButtons route={route} navigation={navigation} />,
				title: colData.getCollection.name
			})
		}
	}, [selectionEnabled, selectedItems])

	async function deleteManyHandler() {
		loadingSpinner.setLoading();

		try {
			await deleteMany({
				variables: {
					ids: selectedItems
				},
				update: (cache) => {
					cache.modify({
						id: `Collection:${colId}`,
						fields: {
							lastUpdate: () => new Date().getTime(),
							//@ts-ignore Meta is not a reference
							meta: (oldMeta: ICollectionMeta) => ({
								...oldMeta,
								phrasesCount: oldMeta.phrasesCount - selectedItems.length
							})
						}
					});
					selectedItems.forEach((id) => {
						cache.evict({ id: `Phrase:${id}` });
					});
				}
			});
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to delete phrases ${e.toString()}`);
		}

		loadingSpinner.dismissLoading();
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

	async function setTutorialPassed() {
		setShowTutorial(false);
		await AsyncStorage.setItem("collectionTutorialPassed", "true");
	}

	if(loading || colDataLoading) return <Loader />
	if(error || colDataError) return <ErrorComponent message="Failed to load collection data" />

	if(data.getCollectionPhrases?.length === 0) return (
		<View style={styles.container}>
			<NoPhrases />
		</View>
	)

	if(searchQuery) return (
		<View style={styles.container}>
			<Search placeholder="Search phrases..." initialState={searchQuery} onChange={setSearchQuery} />
			<SearchResults query={searchQuery} colId={colId} navigation={navigation} />
		</View>
	)

	return (
		<View style={styles.container}>
			<LearnButton colId={colId} color={colData.getCollection.color} navigation={navigation} />
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<MovePhrase id={selectedItems} currentColId={colId} moveMany onSuccess={() => {
					setSelectedItems([]);
					setDisplayModal(false);
					setSelectionEnabled(false);
				}} />
			</ModalWithBody>
			<ModalWithBody visible={showTutorial} onClose={setTutorialPassed}>
				<CollectionTutorial onClose={setTutorialPassed} />
			</ModalWithBody>
			{
				colData?.getCollection.isAutoGenerated !== true &&
				<Search placeholder="Search phrases..." initialState="" onChange={setSearchQuery} />
			}
			<FlatList
				style={styles.list}
				data={data?.getCollectionPhrases}
				renderItem={({ item: phrase }) => 
					<View style={{ marginBottom: 12 }}>
						<CollectionPhrase 
							key={phrase.id} 
							phrase={phrase} 
							navigation={navigation}
							editable={!colData.getCollection.isAutoGenerated}
							selectable={true}
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
					</View>
				}
				keyExtractor={(phrase) => phrase.id}
			></FlatList>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		position: "relative",
		height: "100%",
		paddingHorizontal: 10,
		paddingVertical: 7
	},
	list: {
		paddingVertical: 8
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