import { useEffect } from "react";
import { getAuthToken, setAuthToken } from "../utils/authToken";
import { useQuery } from "@apollo/client";
import { GET_SESSION } from "../query/authorization";
import Loader from "./Loader";
import Welcome from "./Welcome";
import { IAuthData } from "../types/authorization";
import session from "../store/session";
import { observer } from "mobx-react-lite";
import ErrorComponent from "./Error";

const AuthorizationChecker = observer(function ({ children }: any) {
	const { data, error } = useQuery(GET_SESSION, { 
		context: {
			headers: {
				"Authorization": `Bearer ${session.data.token}`
			}
		}, 
		skip: !session.data.token  || !!session.data.sid
	});

	useEffect(() => {
		session.loadingStart();

		getAuthToken().then((res) => {
			session.tokenLoaded(res);
		}).catch((err) => {
			session.sessionError(err);
		})
	}, []);

	useEffect(() => {
		if(!data) return;
		session.dataLoaded(data.getSession);
	}, [data])
	
	useEffect(() => {
		if(!error) return;
		session.sessionError(error);
	}, [error])

	async function updateCredentials(data: IAuthData) {
		let savedToken;

		try {
			savedToken = await setAuthToken(data.token);
		} catch (e) {
			console.log(e);
		}

		session.dataLoaded(data);
	}

	if(session.error) return <ErrorComponent message={session.error.toString()} />

	if(session.loading || (!session.loaded && !session.error)) return <Loader />

	if(!session.data.token || !session.data.sid) return <Welcome updateCredentials={updateCredentials} />

	return children;
});

export default AuthorizationChecker;