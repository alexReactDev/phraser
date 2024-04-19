import * as fs from "node:fs/promises";
import path from "node:path";
import globalErrorHandler from "../misc/globalErrorHandler";

type AccountSecurityEventType = "Account created" | "Account deleted" | "Login" | "Password changed" | "Password reset"

interface IAccountSecurityEvent {
	date: string,
	ip: string,
	type: AccountSecurityEventType,
	user: string
}

export default async function logAccountSecurityEvent(event: IAccountSecurityEvent) {
	try {
		await fs.appendFile(path.join(__dirname, "../../", "log", "account-security.log"), 
`
Date: ${event.date}
type: ${event.type}
IP: ${event.ip}
User: ${event.user}

===
`		
		);
	} catch (e: any) {
		globalErrorHandler(e);
	}
}