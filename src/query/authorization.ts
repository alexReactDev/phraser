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
	mutation signup($input: SignUpInput) {
		signup(input: $input) {
			token,
			sid,
			userId
		}
	}
`;