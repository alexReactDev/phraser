import { Request, Response, NextFunction } from "express";

function throttleMiddleware(req: Request, res: Response, next: NextFunction) {
	if(process.env.DEV_MODE !== "true") return next();
	
	console.log("DEV mode is true. Throttling enabled");

	setTimeout(() => {next()}, +(process.env.THROTTLE_MS as string))
}

export default throttleMiddleware;