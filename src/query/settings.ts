import { gql } from "@apollo/client";

export const UPDATE_USER_SETTINGS = gql`
	mutation updateUserSettings($id: ID!, $input: PartialSettingsInput!) {
		updateUserSettings(id: $id, input: $input) {
			id,
			userId,
			settings {
                phrasesOrder,
				theme,
                repetitionsAmount,
                activeProfile
			}
		}
	}
`;

export const GET_USER_SETTING = gql`
	query getUserSettings($id: ID!) {
		getUserSettings(id: $id) {
			id,
			userId,
			settings {
				phrasesOrder,
				theme,
				repetitionsAmount,
				activeProfile,
				disableAutoCollections,
				autoCollectionsSize,
				intervalRepetitionDates,
				useGPT3,
				textDifficulty
			}
		}
	}
`;