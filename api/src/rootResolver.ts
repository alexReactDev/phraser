const mock = require("../mock.json");
const collectionsController = require("./controller/Collections");

const root = {
	createCollection({ input }: any) {		
		mock.collections.push({
			...input,
			id: new Date().getTime(),
			isLocked: false,
			created: new Date().getTime(),
			lastUpdate: new Date().getTime(),
			meta: {
				phrasesCount: 0,
				repetitionsCount: 0
			},
			phrases: [],
			repetitions: []
		});

		console.log(input);

		return mock.collections[mock.collections.length - 1];

	},

	getCollection: collectionsController.getCollection,

	// getCollection({ id }) {
	// 	return mock.collections.find((item) => item.id == id)
	// },

	// getCollections() {
	// 	return mock.collections;
	// },

	getCollections: collectionsController.getCollectionsAll,

	getCollectionPhrases({ id }: any) {
		const collection = mock.collections.find((col: any) => col.id == id);
		const phrases = mock.phrases.filter((phrase: any) => collection.phrases.includes(phrase.id));
		return phrases;
	},

	getPhrase({ id }: any) {
		return mock.phrases.find((phrase: any) => phrase.id == id);
	},
	
	getPhraseCollection({ id }: any) {
		return mock.collections.find((col: any) => col.phrases.includes(+id));
	},

	mutateCollection({ id, input }: any) {

		console.log(input);
		console.log(id);

		const colIdx = mock.collections.findIndex((item: any) => item.id == id);
		console.log(input);

		mock.collections[colIdx] = {
			...mock.collections[colIdx],
			...input
		};

		return mock.collections[colIdx];
	},

	createPhrase({ input, collection }: any) {
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

	mutatePhrase({ id, input, collection }: any) {
		//add existence check
		const phraseIdx = mock.phrases.findIndex((item: any) => item.id == id);

		mock.phrases[phraseIdx] = {
			...mock.phrases[phraseIdx],
			...input
		};

		if(collection && !mock.collections[collection].phrases.includes(mock.phrases[phraseIdx].id)) {
			mock.collections[collection].phrases.push(mock.phrases[phraseIdx].id);
		}

		return mock.phrases[phraseIdx];
	},

	mutatePhrasesMeta({ input }: any) {
		console.log(input);
		return mock.phrases;
	},

	deletePhrase({ id }: any) {
		mock.phrases = mock.phrases.filter((item: any) => item.id != id);

		return mock.phrases;
	},

	deleteCollection({ id }: any) {
		mock.collections = mock.collections.filter((item: any) => item.id != id);

		return mock.collections;
	},

	createCollectionRepetition({ id, input }: any) {
		return mock.collections.find((col: any) => col.id === id);
	}
}

module.exports = root;