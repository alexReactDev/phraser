import { gql } from "@apollo/client";

export const DELETE_USER = gql`
	mutation deleteUser($id: ID!, $password: String!) {
		deleteUser(id: $id, password: $password)
	}
`;