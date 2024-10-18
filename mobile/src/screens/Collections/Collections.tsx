import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_PROFILE_COLLECTIONS } from "../../query/collections";
import ErrorComponent from "../../components/Errors/ErrorComponent";
import Loader from "../../components/Loaders/Loader";
import { ICollection } from "@ts/collections";
import CollectionCard from "./components/CollectionCard";
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "./CollectionScreen/CollectionScreen";
import CollectionHeaderButtons from "./components/CollectionHeaderButtons";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import EditCollection from "../../components/EditCollection";
import Learn from "./Learn/Learn";
import Profiles from "../../components/Profiles";
import settings from "../../store/settings";
import { observer } from "mobx-react-lite";
import NoCollections from "./components/NoCollections";
import Cards from "./Learn/Cards/Cards";
import AIGeneratedText from "./Learn/AIGeneratedText/AIGeneratedText";
import AutoCollections from "./components/AutoCollections";
import WarningMessage from "@components/Errors/WarningMessage";
import ModalWithBody from "@components/ModalWithBody";
import Search from "@components/Search";
import SearchResults from "./components/SearchResults";
import Edit from "./Edit/Edit";
import Description from "./Learn/Description/Description";
import AssociativePictures from "./Learn/AssociativePictures/AssociativePictures";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CollectionsTutorial from "./components/CollectionsTutorial";
import AutoCollectionsTutorial from "./components/AutoCollectionsTutorial";
import { skipTutorial } from "@utils/tutorial";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export type StackNavigatorParams = {
	Collections: undefined,
	Collection: { colId: string },
	Learn: { colId: string },
	Cards: { colId: string },
	AIGeneratedText: { colId: string },
	Description: { colId: string },
	AssociativePictures: { colId: string },
	Edit: { mutateId: string }
}

const StackNavigator = createStackNavigator<StackNavigatorParams>();

function CollectionsNavigation() {
	return (
		<StackNavigator.Navigator
			id="collectionsNavigator"
			screenOptions={{
				headerTitleStyle: {
					fontSize: 17
				}
			}}
		>
			<StackNavigator.Screen name="Collections" component={Collections} options={{
				headerRight: () => <Profiles />
			}} />
			<StackNavigator.Screen name="Collection" component={CollectionScreen} options={(props) => ({
				headerRight: () => <CollectionHeaderButtons {...props} />
			})} />
			<StackNavigator.Screen name="Learn" component={Learn} />
			<StackNavigator.Screen name="Cards" component={Cards}/>
			<StackNavigator.Screen name="AIGeneratedText" component={AIGeneratedText} />
			<StackNavigator.Screen name="Description" component={Description} />
			<StackNavigator.Screen name="AssociativePictures" component={AssociativePictures} />
			<StackNavigator.Screen name="Edit" component={Edit} />
		</StackNavigator.Navigator>
	)
}

type Props = StackScreenProps<StackNavigatorParams, "Collections", "collectionsNavigator">;

const Collections = observer(function ({ navigation }: Props) {
	const { data = [], loading, error } = useQuery(GET_PROFILE_COLLECTIONS, { variables: { id: settings.settings.activeProfile } });
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ autoCollectionsError, setAutoCollectionsError ] = useState<any>("");
	const [ searchQuery, setSearchQuery ] = useState("");

	const [ showTutorial, setShowTutorial ] = useState(false);
	const [ showAutoCollectionsTutorial, setShowAutoCollectionsTutorial ] = useState(false);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			(async () => {
				const tutorialPassed = await AsyncStorage.getItem("collectionsTutorialPassed");
				if(tutorialPassed !== "true") setShowTutorial(true);
			})();

			(async () => {
				const tutorialPassed = await AsyncStorage.getItem("autoCollectionsTutorialPassed");
				if(tutorialPassed !== "true") setShowAutoCollectionsTutorial(true);
			})();
		});
	  
		return unsubscribe;
	}, []);
	
	function autoCollectionsErrorHandler(e: any) {
		setAutoCollectionsError(e);
	}

	async function setTutorialPassed() {
		setShowTutorial(false);
		await AsyncStorage.setItem("collectionsTutorialPassed", "true");
	}

	async function setAutoCollectionsTutorialPassed() {
		setShowAutoCollectionsTutorial(false);
		await AsyncStorage.setItem("autoCollectionsTutorialPassed", "true");
	}

	function skipTutorialHandler() {
		setShowTutorial(false);
		setShowAutoCollectionsTutorial(false);
		skipTutorial();
	}

	if(loading) return <Loader />

	if(error) return <ErrorComponent message="Failed to load collections"/>

	if(searchQuery) return (
		<View style={styles.container}>
			<Search placeholder="Search collections, phrases..." initialState={searchQuery} onChange={setSearchQuery} />
			<SearchResults query={searchQuery} navigation={navigation} collections={data?.getProfileCollections || []} />
		</View>
	)

	if(data.getProfileCollections.length === 0) return (
		<View style={styles.container}>
			<NoCollections />
		</View>
	)

	return (
		<View style={styles.container}>
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<EditCollection onReady={() => setDisplayModal(false)} />
			</ModalWithBody>
			<ModalWithBody visible={showTutorial} onClose={setTutorialPassed}>
				<CollectionsTutorial onClose={setTutorialPassed} skipTutorial={skipTutorialHandler} />
			</ModalWithBody>
			<ModalWithBody visible={showAutoCollectionsTutorial && !showTutorial} onClose={setAutoCollectionsTutorialPassed}>
				<AutoCollectionsTutorial onClose={setAutoCollectionsTutorialPassed} skipTutorial={skipTutorialHandler} />
			</ModalWithBody>
			<Search placeholder="Search collections, phrases..." initialState="" onChange={setSearchQuery} />
			<ScrollView>
				<View style={{ height: 10 }} />
				{
					autoCollectionsError &&
					<View style={styles.errorContainer}>
						<WarningMessage message={`Failed to load auto collections ${autoCollectionsError.toString()}`} />
					</View>
				}
				<View style={styles.list}>
					{
						(!settings.settings.disableAutoCollections && data.getProfileCollections.length !== 0) &&
						<AutoCollections navigation={navigation} onError={autoCollectionsErrorHandler} />
					}
					{
						data.getProfileCollections.map((col: ICollection) => <CollectionCard key={col.id} collection={col} navigation={navigation} />)
					}
				</View>
			</ScrollView>
			<TouchableOpacity
				onPress={() => setDisplayModal(true)}
				style={styles.button}
				activeOpacity={0.8}
			>
				<MaterialCommunityIcons name="shape-square-rounded-plus" size={28} color="#777" />
			</TouchableOpacity>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		paddingHorizontal: 15,
		height: "100%",
		position: "relative"
	},
	list: {
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 15,
		gap: 15,
		justifyContent: "space-between"
	},
	button: {
		position: "absolute",
		bottom: 18,
		right: 12,
		borderRadius: 15,
		backgroundColor: "#f9f9f9ee",
		width: 47,
		height: 47,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "#aaa",
		borderWidth: 1
	},
	modalContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff88"
	},
	modal: {
		width: 300,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		padding: 20,
		position: "relative",
		backgroundColor: "white"
	},
	modalBtn: {
		position: "absolute",
		top: 5,
		right: 5
	},
	errorContainer: {
		marginBottom: 10
	}
})

export default CollectionsNavigation;