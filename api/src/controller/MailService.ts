import nodemailer, { Transporter } from "nodemailer";
import UsersController from "./Users";
import globalErrorHandler from "../misc/globalErrorHandler";

class MailServiceController {
	_transporter: Transporter;
	
	constructor() {
		this._transporter = nodemailer.createTransport({
			//@ts-ignore
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD
			}
		})
	}

	async sendTo({ userId, subject, html }: { userId: string, subject: string, html: string }) {
		const user = await UsersController.getUser({ id: userId });

		let res;

		try {
			res = await this._transporter.sendMail({
				from: process.env.SMTP_USER,
				to: user.email,
				subject,
				html
			})
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Sever error. Failed to send mail ${e}`)
		}

		return res;
	}
}

export default new MailServiceController();