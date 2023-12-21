import logger from "./logger";
import * as Sentry from "@sentry/node";

export default function (e: any) {
	//Some global error handling here
	logger(e);
	Sentry.captureException(e);
}