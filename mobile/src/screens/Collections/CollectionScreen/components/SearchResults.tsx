import { useQuery } from "@apollo/client";
import ErrorComponent from "@components/Errors/ErrorComponent";
import Loader from "@components/Loaders/Loader";
import { SEARCH_COLLECTION_PHRASES } from "@query/search";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CollectionPhrase from "../../components/CollectionPhrase";
import { IPhrase } from "@ts/phrases";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../Collections";

type TNavigation = StackNavigationProp<StackNavigatorParams, "Collection", "collectionsNavigator">;

interface IProps {
	query: string,
	colId: string,
	navigation: TNavigation
}

function SearchResults({ query, colId, navigation }: IProps) {
	const { data, loading, error } = useQuery(SEARCH_COLLECTION_PHRASES, { variables: { pattern: query, colId }});

	if(error) return <ErrorComponent message="Failed to complete search" />

	if(loading) return <Loader />

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>
				Results
			</Text>
			<View style={styles.list}>
				{
					data.searchCollectionPhrases.map((phrase: IPhrase) => <CollectionPhrase phrase={phrase} navigation={navigation} editable={true} selectable={false} />)
				}
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {},
	title: {
		fontSize: 18,
		marginVertical: 8
	},
	list: {
		gap: 12
	}
})

export default SearchResults;