import { Request, Response } from "express";
import db from "../model/db";
import globalErrorHandler from "./globalErrorHandler";
import MailService from "../controller/MailService";

export default async function verificationHandler(req: Request, res: Response) {
	const link = req.params.link;

	let verificationLink;

	try {
		verificationLink = await db.collection("verification_links").findOne({
			link
		});

		if(!verificationLink) throw new Error("Verification link not found");

		if(verificationLink.expiresAt < new Date().getTime()) throw new Error("Verification link expired");

		await db.collection("users").updateOne({ id: verificationLink.userId }, {
			$set: {
				isVerified: true
			}
		})
	} catch (e: any) {
		globalErrorHandler(e);
		return res.sendFile("./assets/VerificationFailure.html", {
			root: process.env.ROOT_PATH
		})
	}

	try {
		await MailService.sendTo({
			userId: verificationLink.userId,
			subject: "Welcome",
			html: "Thanks for your time. Your email was successfully verified and now you can use all application features. Enjoy!"
		})
	} catch (e: any) {
		globalErrorHandler(e);
	}

	return res.sendFile("./assets/VerificationSuccess.html", {
		root: process.env.ROOT_PATH
	})
}