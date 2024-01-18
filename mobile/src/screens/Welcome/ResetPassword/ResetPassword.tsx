import { IAuthData } from "@ts-frontend/authorization";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Text, View } from "react-native";
import { styles } from "./styles/styles";
import SendVerificationCode from "./components/SendVerificationCode";
import ErrorMessage from "@components/Errors/ErrorMessage";
import CheckVerificationCode from "./components/CheckVerificationCode";
import Reset from "./components/Reset";

const ResetPassword = observer(function({ updateCredentials }: { updateCredentials: (data: IAuthData) => void }) {
	const [ code, setCode ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ errorMessage, setErrorMessage ] = useState("");

	return (
		<View style={styles.container}>
			{
				errorMessage &&
				<ErrorMessage message={errorMessage} />
			}
			<Text style={styles.title}>
				Password reset
			</Text>
			{
				code
				?
				<Reset email={email} code={code} onError={setErrorMessage} updateCredentials={updateCredentials} />
				:
				email
				?
				<CheckVerificationCode email={email} onError={setErrorMessage} onCheck={setCode} />
				:
				<SendVerificationCode onError={setErrorMessage} onSend={setEmail} />
			}
		</View>
	)
});



export default ResetPassword;