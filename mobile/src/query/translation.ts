import { gql } from "@apollo/client";

export const GET_TRANSLATED_TEXT = gql`
	query getTranslatedText($input: String!) {
		getTranslatedText(input: $input)
	}
`;