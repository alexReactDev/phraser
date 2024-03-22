import { gql } from "@apollo/client";

export const GET_USER = gql`
	query getUser($id: ID!) {
		getUser(id: $id) {
			id,
			email,
			created
		}
	}
`;

export const DELETE_USER = gql`
	mutation deleteUser($id: ID!, $password: String!) {
		deleteUser(id: $id, password: $password)
	}
`;