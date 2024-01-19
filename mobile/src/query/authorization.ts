import { gql } from "@apollo/client";

export const GET_SESSION = gql`
	query getSession {
		getSession {
			sid, userId
		}
	}
`;

export const LOGIN = gql`
	mutation login($input: LoginInput!) {
		login(input: $input) {
			token,
			sid,
			userId
		}
	}
`;

export const SIGNUP = gql`
	mutation signUp($input: SignUpInput!) {
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

export const CHANGE_PASSWORD = gql`
	mutation changePassword($userId: ID!, $input: ChangePasswordInput!) {
		changePassword(userId: $userId, input: $input)
	}
`;

export const SEND_VERIFICATION_CODE = gql`
	mutation sendVerificationCode($email: String!) {
		sendVerificationCode(email: $email)
	}
`

export const CHECK_VERIFICATION_CODE = gql`
	query checkVerificationCode($email: String!, $code: String!) {
		checkVerificationCode(email: $email, code: $code)
	}
`;

export const RESET_PASSWORD = gql`
	mutation resetPassword($input: resetPasswordInput!) {
		resetPassword(input: $input) {
			token,
			sid,
			userId
		}
	}
`;

export const GET_VERIFICATION_STATUS = gql`
	query getVerificationStatus($userId: String!) {
		getVerificationStatus(userId: $userId) {
			isVerified
		}
	}
`;

export const VERIFY_EMAIL = gql`
	mutation verifyEmail($userId: String!) {
		verifyEmail(userId: $userId)
	}
`;