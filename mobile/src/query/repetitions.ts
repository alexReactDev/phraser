import { gql } from "@apollo/client";

export const CREATE_REPETITION = gql`
	mutation createRepetition($input: RepetitionInput!) {
		createRepetition(input: $input)
	}
`;

export const GET_PROFILE_REPETITIONS = gql`
	query getProfileRepetitions($profileId: String!) {
		getProfileRepetitions(profileId: $profileId) {
			id,
			phrasesCount,
			totalForgotten,
			collectionName,
			repetitionType,
			repetitionsAmount,
			created
		}
	}
`;