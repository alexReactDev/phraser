import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from "@apollo/client";
import session from "@store/session";

const httpLink = new HttpLink({ uri: process.env.EXPO_PUBLIC_API_URL });

const authMiddleware = new ApolloLink((query, next) => {
	if(!session.data.token) return next(query);

	query.setContext({
		headers: {
			"Authorization": `Bearer ${session.data.token}`
		}
	});

	return next(query);
})

export const client = new ApolloClient({
	link: concat(authMiddleware, httpLink),
	cache: new InMemoryCache(),
});