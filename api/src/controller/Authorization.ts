import { IJWT, ILoginInput, ISignUpInput } from "../types/authorization";
import { signJWT } from "../utils/signJWT";

const db = require("../model/db.ts");
const usersController = require("./Users");
const jwt = require("jsonwebtoken");

class AuthorizationController {
	async login({ input }: { input: ILoginInput }) {
		let user;

		try {
			user = await db.collection("users").findOne({ login: input.login });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		if(input.password !== user.password) throw new Error(`Access denied`);

		const token = signJWT({ login: user.login });

		return {...token};
	}

	async logout({}, context: { auth: IJWT }) {
		try {
			await db.collection("revoked_sessions").insertOne({
				value: context.auth.sid
			})
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		return "OK";
	}

	async signUp({ input }: { input: ISignUpInput }) {
		try {
			await usersController.createUser({ input });
		}
		catch(e: any) {
			console.log(e)
			throw new Error(`Server error ${e}`);
		}

		const token = signJWT({ login: input.login });

		return {...token};
	}

	async getSession({}, context: { auth: IJWT }) {
		if(context?.auth?.sid) return { sid: context.auth.sid };

		return "";
	}
}

module.exports = new AuthorizationController();