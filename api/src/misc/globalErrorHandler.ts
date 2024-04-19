import * as Sentry from "@sentry/node";
import * as fs from "node:fs/promises";
import path from "node:path";

export default async function (e: any) {
	Sentry.captureException(e);
	console.log(e);

	try {

		await fs.appendFile(path.join(__dirname, "../../", "log", "error.log"), 
`
Date: ${new Date().toString()}
Handled: True
Error: ${e.toString()}
Location: ${e.stack}

===
`		
		);
	} catch (e: any) {
		Sentry.captureException(e);
		console.log(e);
	}
}