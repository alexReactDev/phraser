const mock = require("../mock.json");

const root = {
	getCollections() {
		return mock.collections;
	},
	getCollectionPhrases({ id }) {
		console.log(id);
		return mock.phrases.filter((phrase) => mock.collections[id].phrases.includes(phrase.id));
	}
}

module.exports = root;