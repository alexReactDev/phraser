import { gql } from "@apollo/client";

export const GET_USER_PROFILES = gql`
	query getUserProfiles($id: ID) {
		getUserProfiles(id: $id) {
			id, name
		}
		getUserSettings(id: $id) {
			settings {
				activeProfile
			}
		}
	}
`;