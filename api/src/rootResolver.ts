const mock = require("../mock.json");
const collectionsController = require("./controller/Collections");
const phrasesController = require("./controller/Phrases");

const root = {
	createCollection: collectionsController.createCollection,
	getCollection: collectionsController.getCollection,
	getCollections: collectionsController.getCollectionsAll,
	deleteCollection: collectionsController.deleteCollection,
	mutateCollection: collectionsController.mutateCollection,
	changeCollectionLock: collectionsController.changeCollectionLock,
	getPhraseCollection: collectionsController.getCollectionByPhrase,

	getPhrase: phrasesController.getPhrase,
	getCollectionPhrases: phrasesController.getPhrasesByCollection,
	createPhrase: phrasesController.createPhrase,
	mutatePhrase: phrasesController.mutatePhrase,
	mutatePhrasesMeta: phrasesController.mutatePhraseMeta,
	deletePhrase: phrasesController.deletePhrase,

	createCollectionRepetition({ id, input }: any) {
		return mock.collections.find((col: any) => col.id === id);
	}
}

module.exports = root;