import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_COLLECTION_PHRASES } from "../../../query/phrases";
import Loader from "../../../components/Loader";
import ErrorComponent from "../../../components/Errors/ErrorComponent";
import CollectionPhrase from "./components/CollectionPhrase";
import { GET_COLLECTION } from "../../../query/collections";
import { FlatList } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";
import NoPhrases from "./components/NoPhrases";

type Props = StackScreenProps<StackNavigatorParams, "Collection", "collectionsNavigator">;

function CollectionScreen({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, loading, error } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId } });
	const { data: colData, loading: colDataLoading, error: colDataError } = useQuery(GET_COLLECTION, { variables: { id: colId } });

	useEffect(() => {
		if(colData)  navigation.setOptions({ title: colData.getCollection.name });
	}, [colData]);

	if(loading || colDataLoading) return <Loader />
	if(error || colDataError) return <ErrorComponent message="Failed to load collection data" />
	return (
		<>
			{
				data.getCollectionPhrases?.length === 0 && <NoPhrases />
			}
			<FlatList
				style={styles.container}
				data={data?.getCollectionPhrases}
				renderItem={({ item: phrase }) => <CollectionPhrase key={phrase.id} phrase={phrase} colId={colId} navigation={navigation} />}
				keyExtractor={(phrase) => phrase.id}
			></FlatList>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	}
})

export default CollectionScreen;