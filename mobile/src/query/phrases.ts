import { gql } from "@apollo/client";

export const GET_COLLECTION_PHRASES = gql`
	query getCollectionPhrases($id: ID!) {
		getCollectionPhrases(id: $id) {
			id,
			value,
			translation,
			collection
		}
	}
`;

export const GET_PROFILE_PHRASES_COUNT = gql`
	query getProfilePhrasesCount($profileId: ID!) {
		getProfilePhrasesCount(profileId: $profileId)
	}
`;

export const GET_PHRASE = gql`
	query getPhrase($id: ID!) {
		getPhrase(id: $id) {
			id,
			value,
			translation,
			collection
		}
	}
`;

export const CREATE_PHRASE = gql`
	mutation createPhrase($input: PhraseInput!, $collection: ID!) {
		createPhrase(input: $input, collection: $collection) {
			id,
			value,
			translation,
			collection
		}
	}
`;

export const MUTATE_PHRASE = gql`
	mutation mutatePhrase($id: ID!, $input: MutatePhraseInput!) {
		mutatePhrase(id: $id, input: $input) {
			id,
			value,
			translation
		}
	}
`;

export const MOVE_PHRASE = gql`
	mutation movePhrase($id: ID!, $destId: ID!) {
		movePhrase(id: $id, destId: $destId) {
			id,
			collection
		}
	}
`;

export const MOVE_PHRASES_MANY = gql`
	mutation movePhrasesMany($ids: [ID]!, $destId: ID!) {
		movePhrasesMany(ids: $ids, destId: $destId) {
			id,
			collection
		}
	}
`;

export const MUTATE_PHRASE_META = gql`
	mutation mutatePhraseMeta($id: ID!, $input: PhraseMetaInput!) {
		mutatePhraseMeta(id: $id, input: $input)
	}
`

export const DELETE_PHRASE = gql`
	mutation deletePhrase($id: ID!) {
		deletePhrase(id: $id)
	}
`;

export const DELETE_PHRASES_MANY = gql`
	mutation deletePhrasesMany($ids: [ID]!) {
		deletePhrasesMany(ids: $ids)
	}
`;