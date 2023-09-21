import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_COLLECTIONS_ALL } from "../query/collections";
import ErrorComponent from "./Error";
import Loader from "./Loader";
import { ICollection } from "../types/collections";
import CollectionCard from "./CollectionCard";
import { createStackNavigator } from "@react-navigation/stack";
import CollectionScreen from "./CollectionScreen";
import CollectionHeaderButtons from "./CollectionHeaderButtons";

const StackNavigator = createStackNavigator();

function CollectionsNavigation() {
	return (
		<StackNavigator.Navigator>
			<StackNavigator.Screen name="Collections" component={Collections} />
			<StackNavigator.Screen name="Collection" component={CollectionScreen} options={(props) => ({
				headerRight: () => <CollectionHeaderButtons {...props} />
			})} />
		</StackNavigator.Navigator>
	)
}

function Collections({ navigation }: any) {
	const { data = [], loading, error } = useQuery(GET_COLLECTIONS_ALL);

	if(loading) return <Loader />

	if(error) return <ErrorComponent />

	return (

		<View style={styles.container}>
			{
				data.getCollections.map((col: ICollection) => <CollectionCard key={col.id} collection={col} navigation={navigation} />)
			}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		flexDirection: "row",
		flexWrap: "wrap",
		rowGap: 15,
		gap: 15,
		justifyContent: "space-between",
	}
})

export default CollectionsNavigation;