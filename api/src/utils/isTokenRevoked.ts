import { Jwt, JwtPayload } from "jsonwebtoken";

const db = require("../model/db.ts");

export async function isTokenRevoked(req: Request, jwt: Jwt) {
	let session;

	try {
		session = await db.collection("revoked_sessions").findOne({ value: (jwt.payload as JwtPayload).sid });
	} catch (e) {
		console.log(e);
		return true;
	}

	if(session) return true;


	return false;
}