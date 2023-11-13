const logger = require("./logger");

module.exports = function (e: any) {
	//Some global error handling here
	logger(e);
}