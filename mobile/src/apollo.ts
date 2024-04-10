import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import session from "@store/session";

const httpLink = new HttpLink({ uri: `${process.env.EXPO_PUBLIC_API_URL}/graphql` });

const authMiddleware = new ApolloLink((query, next) => {
	if(!session.data.token) return next(query);

	const oldHeaders = query.getContext().headers;

	const headers: any = {
		"Authorization": `Bearer ${session.data.token}`
	};

	if(session.data.type !== "default") {
		headers["X-oauth-token"] = session.data.oauthToken;
	};

	query.setContext({
		headers: {
			...oldHeaders,
			...headers
		}
	});

	return next(query);
});

let requiresTokenRefresh = false;

const authErrorHandler = onError(({ networkError, operation, forward }) => {
	//@ts-ignore networkError does have statusCode field
	if(networkError?.statusCode === 401 && session.data.type !== "default") {
		requiresTokenRefresh = true;
		return forward(operation);
	//@ts-ignore networkError does have statusCode field
	} else if (networkError?.statusCode === 401) {
		session.logout();
	}
});

const refreshOAuthToken = setContext(async ( req, oldContext ) => {
	if(!requiresTokenRefresh || session.data.type === "default") return {};

	requiresTokenRefresh = false;

	let authData;

	try {		
		await GoogleSignin.hasPlayServices();
		authData = await GoogleSignin.signInSilently();
		if(!authData || !authData.idToken) throw new Error("Failed to get necessary auth data");
	} catch(e: any) {
		console.log("Google authorization failed " + e.toString());
		session.logout();
		return {};
	}

	let res;

	try {
		res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/test`, {
			headers: {
				"Authorization": `Bearer ${session.data.token}`,
				"X-oauth-token": authData.idToken
			}
		})
	} catch(e: any) {
		console.log(e);
	}

	if(res?.status === 401) {
		session.logout();
		return {};
	}

	session.updateOauthToken(authData.idToken);

	return {
		headers: {
			...oldContext.headers,
			"X-oauth-token": authData.idToken
		}
	}
})

export const client = new ApolloClient({
	link: from([authMiddleware, authErrorHandler, refreshOAuthToken, httpLink]),
	cache: new InMemoryCache(),
});