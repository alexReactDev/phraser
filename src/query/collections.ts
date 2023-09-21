import { gql } from "@apollo/client";

export const GET_COLLECTION = gql`
	query getCollection($id: ID) {
		getCollection(id: $id) {
			id,
			name,
			lastUpdate,
			isLocked,
			color,
			created,
			phrases,
			repetitions,
			meta {
				phrasesCount,
				repetitionsCount
			}
		}
	}
`;

export const GET_COLLECTIONS_ALL = gql`
	query GetCollections {
		getCollections {
			id,
			name,
			lastUpdate,
			isLocked,
			color,
			created,
			phrases,
			repetitions,
			meta {
				phrasesCount,
				repetitionsCount
			}
		}
	}
`;

export const MUTATE_COLLECTION = gql`
	mutation mutateCollection($id: ID, $input: CollectionInput) {
		mutateCollection(id: $id, input: $input) {
			id
		}
	}
`;

export const DELETE_COLLECTION = gql`
	mutation deleteCollection($id: ID) {
		deleteCollection(id: $id) {
			id
		}
	}
`;