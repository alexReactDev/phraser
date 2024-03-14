import { Request } from "express";
import { Jwt, JwtPayload } from "jsonwebtoken";

import db from "../model/db";

export async function isTokenRevoked(req: Request, jwt: Jwt | undefined) {
	if(!jwt) return false;

	const payload = jwt.payload as JwtPayload;

	let session;

	try {
		session = await db.collection("active_sessions").findOne({
			sid: payload.sid
		})
	} catch (e) {
		console.log(e);
		return true;
	}

	if(!session) return true;

	if(payload.type === "google") {
		const token = req.get("X-oauth-token");
		
		if(!token) return true;

		try {
			const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
			if(!res.ok) throw new Error(res.status + " " + res.statusText);
		} catch (e: any) {
			return true;
		}
	}

	return false;
}