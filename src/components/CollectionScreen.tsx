import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GET_COLLECTION_PHRASES } from "../query/phrases";
import Loader from "./Loader";
import ErrorComponent from "./Error";
import { IPhrase } from "../types/phrases";
import CollectionPhrase from "./CollectionPhrase";

function CollectionScreen({ route }: any) {
	const colId = route.params.colId;

	const { data = [], loading, error } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId } })

	console.log(error);

	if(loading) return <Loader />
	if(error) return <ErrorComponent />

	return (
		<View style={styles.container}>
			{
				data.getCollectionPhrases.map((phrase: IPhrase) => <CollectionPhrase phrase={phrase} />)
			}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
		gap: 12
	}
})

export default CollectionScreen;