import { gql } from "@apollo/client";

export const MUTATE_PHRASES_META = gql`
	mutation mutatePhrasesMeta($input: [PhraseRepetitionInput]) {
		mutatePhrasesMeta(input: $input) {
			id
		}
	}
`;

export const CREATE_COLLECTION_REPETITION = gql`
	mutation createCollectionRepetition($id: ID, $input: RepetitionInput) {
		createCollectionRepetition(id: $id, input: $input) {
			id
		}
	}
`;