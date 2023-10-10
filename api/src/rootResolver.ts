const mock = require("../mock.json");
const collectionsController = require("./controller/Collections");
const phrasesController = require("./controller/Phrases");
const profilesController = require("./controller/Profiles");
const usersController = require("./controller/Users");
const authController = require("./controller/Authorization");
const settingsController = require("./controller/Settings");

const root = {
	login: authController.login,
	signUp: authController.signUp,
	logout: authController.logout,
	getSession: authController.getSession,

	getUserSettings: settingsController.getUserSettings,
	setUserSettings: settingsController.setUserSettings,
	updateUserSettings: settingsController.updateUserSettings,

	createProfile: profilesController.createProfile,
	getUserProfiles: profilesController.getUserProfiles,

	createCollection: collectionsController.createCollection,
	getCollection: collectionsController.getCollection,
	getCollections: collectionsController.getCollectionsByProfile,
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