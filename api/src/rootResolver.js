const mock = require("../mock.json");

const root = {
	getCollections() {
		return mock.collections;
	}
}

module.exports = root;