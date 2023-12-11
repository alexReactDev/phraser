import { gql } from "@apollo/client";

export const GET_GENERATED_TEXT = gql`
	query getGeneratedText($phrases: [String]!) {
		getGeneratedText(phrases: $phrases)
	}
`;

export const GET_GENERATED_SENTENCES = gql`
		query getGeneratedSentences($phrases: [String]!) {
		getGeneratedSentences(phrases: $phrases)
	}
`;