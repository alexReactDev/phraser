import { useEffect, useState } from "react";
import { getAuthToken, setAuthToken } from "../utils/authToken";
import { useQuery } from "@apollo/client";
import { GET_SESSION } from "../query/authorization";
import Loader from "./Loader";
import Welcome from "./Welcome";
import { IAuthData } from "../types/authorization";

function AuthorizationChecker({ children }: any) {
	const [ isTokenLoading, setTokenLoading ] = useState(true);
	const [ token, setToken ] = useState<string | null>(null);
	const { data, loading, updateQuery } = useQuery(GET_SESSION, { skip: !token });

	useEffect(() => {
		getAuthToken().then((res) => {
			setToken(res);
			setTokenLoading(false);
		})
	}, []);

	async function updateCredentials(data: IAuthData) {
		console.log("Update credentials!!!!");
		console.log(data);
		let savedToken;

		try {
			savedToken = await setAuthToken(data.token);
		} catch (e) {
			console.log(e);
		}

		setToken(savedToken as string);

		updateQuery(() => ({
				getSession: {
					sid: data.sid
				}
			})
		);
	}

	if(isTokenLoading || loading) return <Loader />

	if(!token || !data ) return <Welcome updateCredentials={updateCredentials} />

	return children;
}

export default AuthorizationChecker;