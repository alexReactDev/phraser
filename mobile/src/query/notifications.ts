import { gql } from "@apollo/client";

export const UPDATE_NOTIFICATIONS_TOKEN = gql`
	mutation updateNotificationsToken($userId: String!, $token: String!) {
		updateNotificationsToken(userId: $userId, token: $token)
	}
`;