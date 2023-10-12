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

export const CREATE_PROFILE = gql`
	mutation createProfile($input: ProfileInput) {
		createProfile(input: $input)
	}
`;

export const MUTATE_PROFILE = gql`
	mutation mutateProfile($id: ID, $input: MutateProfileInput) {
		mutateProfile(id: $id, input: $input)
	}
`;

export const DELETE_PROFILE = gql`
	mutation deleteProfile($id: ID) {
		deleteProfile(id: $id)
	}
`;