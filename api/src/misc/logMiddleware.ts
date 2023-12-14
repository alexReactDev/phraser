import { NextFunction, Request, Response } from "express";
import logger from "./logger";

export default function logMiddleware(req: Request, res: Response, next: NextFunction) {
	logger(`Connection from ${req.ip}. ${new Date().toString()}`);

	next();
}