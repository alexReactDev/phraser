import { gql } from "@apollo/client";

export const CREATE_REPETITION = gql`
	mutation createRepetition($input: RepetitionInput) {
		createRepetition(input: $input)
	}
`;