function throttleMiddleware(req, res, next) {
	if(process.env.DEV_MODE !== "true") return next();
	
	console.log("DEV mode is true. Throttling enabled");

	setTimeout(() => {next()}, +process.env.THROTTLE_MS)
}

module.exports = throttleMiddleware;