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

export const GET_COLLECTION_NAMEID = gql`
	query getCollection($id: ID) {
		getCollection(id: $id) {
			id,
			name
		}
	}
`;

export const GET_COLLECTIONS_NAMEID_ALL = gql`
	query GetCollectionsNameId {
		getCollections {
			id,
			name
		}
	}
`;

export const CREATE_COLLECTION = gql`
	mutation createCollection($input: CollectionInput) {
		createCollection(input: $input) {
			id
		}
	}
`;

export const MUTATE_COLLECTION = gql`
	mutation mutateCollection($id: ID, $input: CollectionInput) {
		mutateCollection(id: $id, input: $input) 
	}
`;

export const CHANGE_COLLECTION_LOCK = gql`
	mutation changeCollectionLock($id: ID, $input: ChangeCollectionLockInput) {
		changeCollectionLock(id: $id, input: $input)
	}
`;


export const DELETE_COLLECTION = gql`
	mutation deleteCollection($id: ID) {
		deleteCollection(id: $id) {
			id
		}
	}
`;