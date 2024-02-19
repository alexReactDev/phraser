import { gql } from "@apollo/client";

export const SEARCH_PROFILE_COLLECTIONS = gql`
	query searchProfileCollections($pattern: String!, $profile: ID!) {
		searchProfileCollections(pattern: $pattern, profile: $profile) {
			id,
			name,
			color,
			lastUpdate,
			meta {
				phrasesCount
			}
		}
	}
`;

export const SEARCH_PROFILE_PHRASES = gql`
	query searchProfilePhrases($pattern: String!, $profile: ID!) {
		searchProfilePhrases(pattern: $pattern, profile: $profile) {
			id,
			value,
			translation,
			collection
		}
	}
`;

export const SEARCH_COLLECTION_PHRASES = gql`
	query searchCollectionPhrases($pattern: String!, $colId: ID!) {
		searchCollectionPhrases(pattern: $pattern, colId: $colId) {
			id,
			value,
			translation
		}
	}
`;