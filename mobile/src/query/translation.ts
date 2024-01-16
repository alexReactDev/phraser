import { gql } from "@apollo/client";

export const GET_TRANSLATED_TEXT = gql`
	query getTranslatedText($input: String!) {
		getTranslatedText(input: $input)
	}
`;

export const GET_SUPPORTED_LANGUAGES = gql`
	query getSupportedLanguages {
		getSupportedLanguages {
			value,
			name
		}
	}
`;