import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_COLLECTIONS_ALL } from "../query/collections";
import ErrorComponent from "./Error";
import Loader from "./Loader";
import { ICollection } from "../types/collections";
import CollectionCard from "./CollectionCard";
import { StackScreenProps, createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "./CollectionScreen";
import CollectionHeaderButtons from "./CollectionHeaderButtons";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import EditCollection from "./EditCollection";
import Learn from "./Learn";
import Profiles from "./Profiles";

export type StackNavigatorParams = {
	Collections: undefined,
	Collection: { colId: number },
	Learn: { colId: number }
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
		</StackNavigator.Navigator>
	)
}

type Props = StackScreenProps<StackNavigatorParams, "Collections", "collectionsNavigator">;

function Collections({ navigation }: Props) {
	const { data = [], loading, error } = useQuery(GET_COLLECTIONS_ALL);
	const [ displayModal, setDisplayModal ] = useState(false);

	if(loading) return <Loader />

	if(error) return <ErrorComponent />

	return (
		<View style={styles.container}>
			<Modal
				visible={displayModal}
				animationType="slide"
				transparent={true}
			>
				<View
					style={styles.modalContainer}
				>
					<View
						style={styles.modal}
					>
						<TouchableOpacity
							onPress={() => setDisplayModal(false)}
							style={styles.modalBtn}
						>
							<Ionicons name="close" color="gray" size={24} />
						</TouchableOpacity>
						<EditCollection onReady={() => setDisplayModal(false)} />
					</View>
				</View>
			</Modal>
			<ScrollView>
				<View
					style={styles.list}
				>
					{
						data.getCollections.map((col: ICollection) => <CollectionCard key={col.id} collection={col} navigation={navigation} />)
					}
				</View>
			</ScrollView>
			<TouchableOpacity
				onPress={() => setDisplayModal(true)}
				style={styles.button}
			>
				<Ionicons name="add" size={24} color="gray" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
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
		borderRadius: 50,
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
	}
})

export default CollectionsNavigation;