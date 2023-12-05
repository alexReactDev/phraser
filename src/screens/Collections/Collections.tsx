import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_PROFILE_COLLECTIONS } from "../../query/collections";
import ErrorComponent from "../../components/Errors/ErrorComponent";
import Loader from "../../components/Loaders/Loader";
import { ICollection } from "../../../types/collections";
import CollectionCard from "./components/CollectionCard";
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "./CollectionScreen/CollectionScreen";
import CollectionHeaderButtons from "./components/CollectionHeaderButtons";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import EditCollection from "./components/EditCollection";
import Learn from "./Learn/Learn";
import Profiles from "../../components/Profiles";
import settings from "../../store/settings";
import { observer } from "mobx-react-lite";
import NoCollections from "./components/NoCollections";
import Cards from "./Learn/Cards/Cards";
import AIGeneratedText from "./Learn/AIGeneratedText/AIGeneratedText";
import AutoCollections from "./components/AutoCollections";
import WarningMessage from "@components/Errors/WarningMessage";
import ErrorMessage from "@components/Errors/ErrorMessage";
import ModalComponent from "@components/ModalComponent";

export type StackNavigatorParams = {
	Collections: undefined,
	Collection: { colId: string },
	Learn: { colId: string },
	Cards: { colId: string },
	AIGeneratedText: { colId: string }
}

const StackNavigator = createStackNavigator<StackNavigatorParams>();

function CollectionsNavigation() {
	return (
		<StackNavigator.Navigator
			id="collectionsNavigator"
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
		</StackNavigator.Navigator>
	)
}

type Props = StackScreenProps<StackNavigatorParams, "Collections", "collectionsNavigator">;

const Collections = observer(function ({ navigation }: Props) {
	const { data = [], loading, error } = useQuery(GET_PROFILE_COLLECTIONS, { variables: { id: settings.settings.activeProfile } });
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ autoCollectionsError, setAutoCollectionsError ] = useState("");

	if(loading) return <Loader />

	if(error) return <ErrorComponent message="Failed to load collections"/>

	function autoCollectionsErrorHandler(e: any) {
		setAutoCollectionsError(e);
	}

	return (
		<View style={styles.container}>
			<ModalComponent visible={displayModal} onClose={() => setDisplayModal(false)}>
				<EditCollection onReady={() => setDisplayModal(false)} />
			</ModalComponent>
			<ScrollView>
				{
					autoCollectionsError &&
					<View style={styles.errorContainer}>
						<WarningMessage message={autoCollectionsError} />
					</View>
				}
				<View
					style={styles.list}
				>
					{
						!settings.settings.disableAutoCollections &&
						<AutoCollections navigation={navigation} onError={autoCollectionsErrorHandler} />
					}
					{
						data.getProfileCollections.map((col: ICollection) => <CollectionCard key={col.id} collection={col} navigation={navigation} />)
					}
				</View>
				{
					data.getProfileCollections.length === 0 && <NoCollections />
				}
			</ScrollView>
			<TouchableOpacity
				onPress={() => setDisplayModal(true)}
				style={styles.button}
			>
				<Ionicons name="add" size={28} color="gray" />
			</TouchableOpacity>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		padding: 15,
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
		bottom: 10,
		right: 10,
		borderRadius: 12,
		backgroundColor: "white",
		width: 45,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "gray",
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