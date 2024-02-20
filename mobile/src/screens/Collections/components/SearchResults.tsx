import { useQuery } from "@apollo/client";
import ErrorComponent from "@components/Errors/ErrorComponent";
import ErrorMessage from "@components/Errors/ErrorMessage";
import Loader from "@components/Loaders/Loader";
import { SEARCH_PROFILE_COLLECTIONS, SEARCH_PROFILE_PHRASES } from "@query/search";
import settings from "@store/settings";
import { ICollection } from "@ts/collections";
import { observer } from "mobx-react-lite";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import CollectionRow from "./CollectionRow";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";
import CollectionPhrase from "./CollectionPhrase";
import { IPhrase } from "@ts/phrases";
import { useMemo, useState } from "react";

type TNavigation = StackNavigationProp<StackNavigatorParams, "Collections", "collectionsNavigator">;

interface IProps {
	collections: ICollection[],
	query: string,
	navigation: TNavigation
}

interface IColPhrases { 
	colId: string, 
	phrases: IPhrase[] 
}

const SearchResults = observer(function({ collections, query, navigation }: IProps) {
	const { data: collectionsData, loading: collectionsLoading, error: collectionsError } = useQuery(SEARCH_PROFILE_COLLECTIONS, { variables: { pattern: query, profile: settings.settings.activeProfile }});
	const { data: phrasesData, loading: phasesLoading, error: phrasesError} = useQuery(SEARCH_PROFILE_PHRASES, { variables: { pattern: query, profile: settings.settings.activeProfile }});
	
	const [ phrases, setPhrases ] = useState<IColPhrases[]>([]);

	useMemo(() => {
		if(!phrasesData) return;

		const sortedPhrases: IColPhrases[] = [];

		phrasesData?.searchProfilePhrases.forEach((phrase: IPhrase) => {
			for(let i = 0; i < sortedPhrases.length; i++) {
				if(sortedPhrases[i].colId === phrase.collection) {
					sortedPhrases[i].phrases.push(phrase);
					return;
				}
			}

			sortedPhrases.push({
				colId: phrase.collection,
				phrases: [phrase]
			})
		});

		setPhrases(sortedPhrases);
	}, [phrasesData])

	if(collectionsError && phrasesError) return <ErrorComponent message="Failed to complete search" />

	if(collectionsLoading || phasesLoading) return <Loader />

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>
				Collections
			</Text>
			<View style={styles.collectionsContainer}>
				{
					collectionsError &&
					<ErrorMessage message={`Failed to search for collections`} />
				}
				{
					collectionsData?.searchProfileCollections.length === 0 &&
					<Text style={styles.text}>
						No collections found
					</Text>
				}
				{
					collectionsData?.searchProfileCollections.map((col: ICollection) => <CollectionRow key={col.id} collection={col} navigation={navigation} />)
				}
			</View>
			<Text style={styles.title}>
				Phrases
			</Text>
			<View style={styles.phrases}>
				{
					phrasesError && 
					<ErrorMessage message={`Failed to search for phrases`} />
				}
				{
					phrases.length === 0 &&
					<Text style={styles.text}>
						No phrases found
					</Text>
				}
				{
					phrases.map((data: IColPhrases) => {
						const col = collections.find((col) => col.id === data.colId)!;

						return (
							<View key={data.colId} style={{...styles.collectionContainer, borderColor: col.color }}>
								<View style={{...styles.collectionHeader, backgroundColor: col.color}}>
									<Text style={styles.collectionTitle}>
										{col.name}
									</Text>
								</View>
								<View style={styles.phrasesContainer}>
									{
										data.phrases.map((phrase) => <CollectionPhrase key={phrase.id} phrase={phrase} navigation={navigation} editable={true} selectable={false} />)
									}
								</View>
							</View>
						)
					})
				}
			</View>
		</ScrollView>
	)
});

const styles = StyleSheet.create({
	container: {
		paddingTop: 8
	},
	title: {
		marginBottom: 10,
		fontSize: 18,
	},
	text: {
		textAlign: "center",
		color: "grey"
	},
	collectionsContainer: {
		marginBottom: 15,
		gap: 7
	},
	phrases: {
		gap: 15,
		paddingBottom: 15
	},
	collectionContainer: {
		borderLeftWidth: 2
	},
	collectionHeader: {
		marginBottom: 10,
		padding: 10,
		borderRadius: 5,
		marginLeft: -2,
		marginTop: -2
	},
	collectionTitle: {
		color: "white",
		fontSize: 16
	},
	phrasesContainer: {
		paddingLeft: 10,
		gap: 12
	}
})

export default SearchResults;