import { IChangePasswordInput, ILoginInput, IResetPasswordInput } from "../types/authorization";
import { signJWT } from "../misc/signJWT";

import db from "../model/db";
import usersController from "./Users";
import globalErrorHandler from "../misc/globalErrorHandler";
import { IContext } from "@ts-backend/context";
import generateId from "../misc/generateId";
import { IUser, IUserInput } from "@ts-backend/users";
import bcrypt from "bcrypt";
import mailService from "./MailService";
import { v4 } from "uuid";
import MailService from "./MailService";
import { AuthType } from "@ts/authorization"
import moment from "moment";
import getMailHTML from "../misc/getMailHTML";

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

		const ip = context.req.headers["x-real-ip"] || context.req.ip || "unknown";
		const userAgent = context.req.headers["user-agent"] || "unknown";
		const date = new Date();

		mailService.sendTo({ 
			userId: user.id, 
			subject: "New login", 
			html: getMailHTML(`New successful login from ip ${context.req.ip} at ${moment(date).format("HH:MM DD/MM/YYYY")}. If it wasn't you, please consider changing your password.`, {
				action: "Successful login",
				date: date.toString(),
				ip: ip as string,
				userAgent
			})
		});

		const session = await this._createSession({ userId: user.id });

		const token = await signJWT({
			sid: session.sid,
			userId: user.id,
			type: "default"
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
			userId,
			type: "default"
		});

		return {...token};
	}

	async getSession({}, context: IContext) {
		if(context?.auth?.sid) return { sid: context.auth.sid, userId: context.auth.userId };

		return "";
	}

	async _createSession({ userId, type }: { userId: string, type?: AuthType }) {
		const sid = generateId();

		const session = {
			sid,
			userId,
			type,
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
			html: getMailHTML(`Please, follow this link in order to verify your email: ${process.env.HOST}/verify/${link}. If you didn't request verification, just ignore this mail.`),
		})
	}

	async getVerificationStatus({ userId }: { userId: string}) {
		const user = await usersController.getUser({ id: userId });

		return {
			isVerified: user.isVerified
		}
	}

	async changePassword({ userId, input } : { userId: string, input: IChangePasswordInput }, context: IContext) {
		let user;

		try {
			user = await db.collection("users").findOne({ id: userId });

			if(!user) throw new Error("404. User not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to change password. ${e}`);
		}
		
		if(!bcrypt.compareSync(input.oldPassword, user.password)) throw new Error("403. Access denied - wrong password");
		
		try {
			const hash = await bcrypt.hash(input.newPassword, 3);
			
			await db.collection("users").updateOne({ id: userId }, {
				$set: {
					password: hash
				}
			})
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to change password ${e}`)
		}

		try {
			await db.collection("active_sessions").deleteMany({
				userId,
				sid: {
					$ne: context.auth.sid
				}
			})
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to clear sessions ${e}`)
		}

		const ip = context.req.headers["x-real-ip"] || context.req.ip || "unknown";
		const userAgent = context.req.headers["user-agent"] || "unknown";
		const date = new Date();

		MailService.sendTo({
			userId,
			subject: "Password changed",
			html: getMailHTML(`Your password had been changed from ip: ${ip} at ${moment(date).format("HH:MM DD/MM/YYYY")}. If it wasn't you, please consider resetting your password.`, {
				action: "Password change",
				date: date.toString(),
				ip: ip as string,
				userAgent
			})
		})
		
		return "OK"
	}

	async resetPassword({ input }: { input: IResetPasswordInput }, context: IContext) {
		const { email, code, newPassword } = input;

		let user;

		try {
			user = await db.collection("users").findOne({ email });

			if(!user) throw new Error("404. User not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to reset password. ${e}`);
		}
		
		await this.checkVerificationCode({ email, code });

		try {
			const hash = await bcrypt.hash(newPassword, 3);

			await db.collection("users").updateOne({ id: user.id }, {
				$set: {
					password: hash
				}
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to reset password ${e}`);
		}

		this._cleanVerificationCodes({ email });

		
		const ip = context.req.headers["x-real-ip"] || context.req.ip || "unknown";
		const userAgent = context.req.headers["user-agent"] || "unknown";
		const date = new Date();

		MailService.sendTo({
			userId: user.id,
			subject: "Password reset",
			html: getMailHTML(`Your password was successfully reset`, {
				action: "Password reset",
				date: date.toString(),
				ip: ip as string,
				userAgent
			})
		})

		const session = await this._createSession({ userId: user.id });

		const token = await signJWT({
			sid: session.sid,
			userId: user.id,
			type: "default"
		});

		return { ...token };
	}

	async sendVerificationCode({ email }: { email: string }, context: IContext) {
		let user;
		
		try {
			user = await db.collection("users").findOne({ email });
			
			if(!user) throw new Error("404. User not found");
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to send verification code. ${e}`);
		}
		
		await this._cleanVerificationCodes({ email });
		
		const code = Math.trunc(Math.random() * 9000 + 1000).toString();
		
		try {
			await db.collection("verification_codes").insertOne({
				email,
				code,
				expiresAt: new Date().getTime() + 1000 * 60 * 60 //1 hour
			})
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to create verification code. ${e}`);
		}

		const ip = context.req.headers["x-real-ip"] || context.req.ip || "unknown";

		MailService.sendTo({
			userId: user.id,
			subject: "Password reset",
			html: getMailHTML(`Password reset attempt from ip: ${ip}. This is your verification code ${code}. If you didn't request password reset, just ignore this mail.`)
		})
		
		return "OK";
	}

	async checkVerificationCode({ email, code }: { email: string, code: string }) {
		let verificationCode;

		try {
			verificationCode = await db.collection("verification_codes").findOne({ email });
		} catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to check verification code. ${e}`)
		}

		if(!verificationCode) throw new Error("404. Verification code wasn't found");
		if(verificationCode.expiresAt < new Date().getTime()) throw new Error("400. Verification code has expired");
		if(verificationCode.code !== code) throw new Error("403. Wrong verification code");

		return "OK";
	}

	async _cleanVerificationCodes({ email }: { email: string }) {
		try {
			await db.collection("verification_codes").deleteMany({ email });
		}
		catch(e: any) {
			globalErrorHandler(e);
			throw new Error(`Failed to clean verification codes. ${e}`);
		}
	}

	async continueWithGoogle({ token }: { token: string }, context: IContext) {
		let data;

		try {
			const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);

			if(!res.ok) throw new Error(res.status + " " + res.statusText);

			data = await res.json();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`400. Google authorization failed - failed to verify token. ${e}`);
		}

		const email = data.email;

		let userId;
		let user: IUser;
		let emailSent = false;

		try {
			user =  await db.collection("users").findOne({ email });
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get user. ${e}`);
		}

		if(!user) {
			userId = await usersController.createUser({ input: { email }, type: "oauth" });

			MailService.sendTo({
				userId,
				subject: "Welcome",
				html: getMailHTML(`You phraser account was created via google. Welcome!`)
			});
			emailSent = true;
		} else {
			userId = user.id;
		}

		if(user && !user.isVerified) {
			await db.collection("users").updateOne({ id: user.id }, {
				$set: {
					isVerified: true
				}
			})
		}

		const session = await this._createSession({ userId, type: "google" });

		const jwt = await signJWT({
			sid: session.sid,
			userId,
			type: "google"
		});

		if(!emailSent) {
			const ip = context.req.headers["x-real-ip"] || context.req.ip || "unknown";
			const userAgent = context.req.headers["user-agent"] || "unknown";
			const date = new Date();

			mailService.sendTo({ 
				userId: user.id, 
				subject: "New login", 
				html: getMailHTML(`New successful login via google from ip ${ip} at ${moment(date).format("HH:MM DD/MM/YYYY")}. If it wasn't you, consider changing your <b>google account</b> password.`, {
					action: "Successful login",
					date: date.toString(),
					ip: ip as string,
					userAgent: userAgent
				})
			});
		}

		return { ...jwt };
	}
}

export default new AuthorizationController();