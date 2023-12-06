import jwt from "jsonwebtoken";
import generateId from "./generateId";

export function signJWT(data: any) {
	const sid = generateId();
	const token = jwt.sign({
		sid,
		...data
	}, (process.env.JWT_SECRET as string));

	return ({
		token,
		sid,
		...data
	})
}