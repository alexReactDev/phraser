import { gql } from "@apollo/client";

export const GET_SESSION = gql`
	query getSession {
		getSession {
			sid, userId
		}
	}
`;

export const LOGIN = gql`
	mutation login($input: LoginInput) {
		login(input: $input) {
			token,
			sid,
			userId
		}
	}
`;

export const SIGNUP = gql`
	mutation signUp($input: SignUpInput) {
		signUp(input: $input) {
			token,
			sid,
			userId
		}
	}
`;

export const LOGOUT = gql`
	mutation logout {
		logout
	}
`;