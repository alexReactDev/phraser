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
				guessed, forgotten, lastRepetition
			}
		}
	}
`;

export const GET_PHRASE = gql`
	query getPhrase($id: ID) {
		getPhrase(id: $id) {
			id,
			value,
			translation,
			created,
			lastUpdate,
			meta {
				guessed, forgotten, lastRepetition
			}
		}
	}
`;

export const GET_PHRASE_WITH_COLLECTION = gql`
	query getPhrase($id: ID) {
		getPhrase(id: $id) {
			id,
			value,
			translation
		}

		getPhraseCollection(id: $id) {
			id,
			name
		}
	}
`;

export const CREATE_PHRASE = gql`
	mutation createPhrase($input: PhraseInput, $collection: ID) {
		createPhrase(input: $input, collection: $collection) {
			id
		}
	}
`;

export const MUTATE_PHRASE = gql`
	mutation mutatePhrase($id: ID, $input: PhraseInput, $collection: ID) {
		mutatePhrase(id: $id, input: $input, collection: $collection) {
			id
		}
	}
`;

export const MUTATE_PHRASE_META = gql`
	mutation mutatePhraseMeta($id: ID, $input: PhraseMetaInput) {
		mutatePhraseMeta(id: $id, input: $input)
	}
`

export const DELETE_PHRASE = gql`
	mutation deletePhrase($id: ID) {
		deletePhrase(id: $id) {
			id
		}
	}
`;