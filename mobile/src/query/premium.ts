import { gql } from "@apollo/client";

export const GET_PREMIUM_DATA = gql`
	query getPremiumData($userId: ID!) {
		getPremiumData(userId: $userId) {
			hasPremium
		}
	}
`;