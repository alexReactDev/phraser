import jwt from "jsonwebtoken";

export async function signJWT(data: any) {
	const token = jwt.sign({ ...data }, (process.env.JWT_SECRET as string), {
			expiresIn: 60 * 60 * 24 * 30 //1 month
		}
	);


	return ({
		token,
		...data
	})
}