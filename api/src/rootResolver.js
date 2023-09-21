const mock = require("../mock.json");

const root = {
	getCollection({ id }) {
		return mock.collections.find((item) => item.id == id)
	},

	getCollections() {
		return mock.collections;
	},
	getCollectionPhrases({ id }) {
		console.log(id);
		return mock.phrases.filter((phrase) => mock.collections[id].phrases.includes(phrase.id));
	},

	createPhrase({ input, collection }) {
		const timestamp = new Date().getTime();

		//move to controller
		const phrase = {
			...input,
			id: timestamp,
			created: timestamp,
			lastUpdate: timestamp,
			meta: {
				repeated: 0,
				guessed: 0,
				forgotten: 0
			}
		}

		//move to model
		mock.phrases.push(phrase);

		mock.collections[collection].phrases.push(timestamp);

		return phrase;
	},

	mutatePhrase({ id, input, collection }) {
		//add existence check
		const phraseIdx = mock.phrases.findIndex((item) => item.id == id);

		mock.phrases[phraseIdx] = {
			...mock.phrases[phraseIdx],
			...input
		};

		if(collection && !mock.collections[collection].phrases.includes(mock.phrases[phraseIdx].id)) {
			mock.collections[collection].phrases.push(mock.phrases[phraseIdx].id);
		}

		return mock.phrases[phraseIdx];
	},

	deletePhrase({ id }) {
		mock.phrases = mock.phrases.filter((item) => item.id != id);

		return mock.phrases;
	},

	deleteCollection({ id }) {
		mock.collections = mock.collections.filter((item) => item.id != id);

		return mock.collections;
	}
}

module.exports = root;