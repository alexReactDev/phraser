const jwt = require("jsonwebtoken");
const generateId = require("./generateId");

export function signJWT(data: any) {
	return jwt.sign({
		sid: generateId(),
		...data
	}, process.env.JWT_SECRET)
}