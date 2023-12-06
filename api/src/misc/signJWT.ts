import jwt from "jsonwebtoken";
import generateId from "./generateId";
import globalErrorHandler from "./globalErrorHandler";
import db from "../model/db";

export async function signJWT(data: any) {
	const sid = generateId();
	const token = jwt.sign(
			{
				sid,
				...data
			}, 
			(process.env.JWT_SECRET as string),
			{
				expiresIn: 60 * 60 * 24 * 30 //1 month
			}
		);

	try {
		await db.collection("active_sessions").insertOne({
			sid,
			created: new Date().getTime(),
			expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24 * 30 //1 month
		})
	} catch (e: any) {
		globalErrorHandler(e);
		throw new Error(`Failed to save session ${e.toString()}`);
	}

	return ({
		token,
		sid,
		...data
	})
}