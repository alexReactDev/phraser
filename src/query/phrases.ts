import { gql } from "@apollo/client";

export const GET_COLLECTION_PHRASES = gql`
	query getCollectionPhrases($id: ID) {
		getCollectionPhrases(id: $id) {
			id,
			value,
			translation,
			created,
			lastUpdate,
			meta {
				repeated, guessed, forgotten
			}
		}
	}
`;

export const DELETE_PHRASE = gql`
	mutation deletePhrase($id: ID) {
		deletePhrase(id: $id) {
			id
		}
	}
`;