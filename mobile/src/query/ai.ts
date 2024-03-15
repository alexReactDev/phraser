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

export const GET_GENERATED_DESCRIPTION = gql`
	query getGeneratedDescription($phrase: String!) {
		getGeneratedDescription(phrase: $phrase)
	}
`;

export const GET_GENERATED_HINT_SENTENCE = gql`
	query getGeneratedHintSentence($phrase: String!) {
		getGeneratedHintSentence(phrase: $phrase)
	}
`;