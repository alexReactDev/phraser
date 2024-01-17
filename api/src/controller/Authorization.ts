import { ILoginInput } from "../types/authorization";
import { signJWT } from "../misc/signJWT";

import db from "../model/db";
import usersController from "./Users";
import globalErrorHandler from "../misc/globalErrorHandler";
import { IContext } from "@ts-backend/context";
import generateId from "../misc/generateId";
import { IUserInput } from "@ts-backend/users";
import bcrypt from "bcrypt";
import mailService from "./MailService";
import { v4 } from "uuid";

class AuthorizationController {
	async login({ input }: { input: ILoginInput }, context: IContext) {
		let user;

		try {
			user = await db.collection("users").findOne({ email: input.email });

			if(!user) throw new Error("404. User not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to log in. ${e}`);
		}

		if(!bcrypt.compareSync(input.password, user.password)) throw new Error(`403. Wrong password`);

		mailService.sendTo({ 
			userId: user.id, 
			subject: "New login", 
			html: `New successful login from ip ${context.req.ip}. If it wasn't you, please consider changing your password.`
		});

		const session = await this._createSession({ userId: user.id });

		const token = await signJWT({
			sid: session.sid,
			userId: user.id
		});

		return {...token};
	}

	async logout({}, context: IContext) {
		try {
			await db.collection("active_sessions").deleteOne({
				sid: context.auth.sid
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to log out ${e}`);
		}

		return "OK";
	}

	async signUp({ input }: { input: IUserInput }) {
		let userId;
		
		try {
			userId = await usersController.createUser({ input });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create user. ${e}`);
		}

		this.verifyEmail({ userId });

		const session = await this._createSession({ userId });

		const token = await signJWT({
			sid: session.sid,
			userId 
		});

		return {...token};
	}

	async getSession({}, context: IContext) {
		if(context?.auth?.sid) return { sid: context.auth.sid, userId: context.auth.userId };

		return "";
	}

	async _createSession({ userId }: { userId: string }) {
		const sid = generateId();

		const session = {
			sid,
			userId,
			created: new Date().getTime(),
			expiresAt: new Date().getTime() + 1000 * 60 * 60 * 24 * 30 //1 month
		};

		try {
			await db.collection("active_sessions").insertOne(session);
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to save session ${e.toString()}`);
		}
	
		return session;
	}

	async verifyEmail({ userId }: { userId: string }) {
		const link = v4();

		try {
			await db.collection("verification_links").insertOne({
				userId,
				link,
				expiresAt: new Date().getTime() + 1000 * 60 * 60 //1 hour
			})
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create verification link ${e}`)
		}

		await mailService.sendTo({ 
			userId, 
			subject: "Please, verify your email", 
			html: `Please, follow this link in order to verify your email: ${process.env.HOST}/verify/${link}. If you didn't request verification, just ignore this mail.`,
		})
	}
}

export default new AuthorizationController();