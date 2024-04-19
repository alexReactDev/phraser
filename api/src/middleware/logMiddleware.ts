import { NextFunction, Request, Response } from "express";
import * as fs from "node:fs/promises";
import path from "node:path";
import globalErrorHandler from "../misc/globalErrorHandler";


export default async function logMiddleware(req: Request, res: Response, next: NextFunction) {
	const ip = req.headers["x-real-ip"] || req.ip || "unknown";

	console.log(`Connection from ${ip}. ${new Date().toString()}`);

	try {

		await fs.appendFile(path.join(__dirname, "../../", "log", "connections.log"), 
`
Date: ${new Date().toString()}
IP: ${req.ip}

===
`		
		);
	} catch (e: any) {
		globalErrorHandler(e);
	}

	next();
}