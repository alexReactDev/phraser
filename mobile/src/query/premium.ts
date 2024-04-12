import { gql } from "@apollo/client";

export const GET_PREMIUM_DATA = gql`
	query getPremiumData($userId: ID!) {
		getPremiumData(userId: $userId) {
			hasPremium,
			created
       		expires
     	    plan
			status
			isTrial
			transaction {
				paid
			}
			trialData {
				started
				ends
			}
		}
	}
`;

export const CANCEL_SUBSCRIPTION = gql`
	mutation cancelSubscription($userId: ID!, $password: String!) {
		cancelSubscription(userId: $userId, password: $password)
	}
`;