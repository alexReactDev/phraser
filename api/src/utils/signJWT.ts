const jwt = require("jsonwebtoken");
const generateId = require("./generateId");

export function signJWT(data: any) {
	const sid = generateId();
	const token = jwt.sign({
		sid,
		...data
	}, process.env.JWT_SECRET);

	return ({
		token,
		sid
	})
}