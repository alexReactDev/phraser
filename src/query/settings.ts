import { gql } from "@apollo/client";

export const UPDATE_USER_SETTINGS = gql`
	mutation updateUserSettings($id: ID, $input: PartialSettingsInput) {
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