import { gql } from "@apollo/client";

export const GET_COLLECTIONS_ALL = gql`
	query GetCollections {
		getCollections {
			id
			name
			lastUpdate
			isLocked
			color
			created
			phrases
			repetitions
			meta {
				phrasesCount
				repetitionsCount
			}
		}
	}
`;