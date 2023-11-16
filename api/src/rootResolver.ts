import { IJWT } from "./types/authorization";

const mock = require("../mock.json");
const collectionsController = require("./controller/Collections");
const phrasesController = require("./controller/Phrases");
const profilesController = require("./controller/Profiles");
const usersController = require("./controller/Users");
const authController = require("./controller/Authorization");
const settingsController = require("./controller/Settings");
const repetitionsController = require("./controller/Repetitions");
const autoCollectionsController = require("./controller/AutoCollections");

const root = {
	login: authController.login,
	signUp: authController.signUp,
	logout: authController.logout,
	getSession: authController.getSession,
	getUser: usersController.getUser,
	deleteUser: usersController.deleteUser,

	getUserSettings: settingsController.getUserSettings,
	setUserSettings: settingsController.setUserSettings,
	updateUserSettings: settingsController.updateUserSettings,

	createProfile: profilesController.createProfile,
	getUserProfiles: profilesController.getUserProfiles,
	mutateProfile: profilesController.mutateProfile,
	deleteProfile: profilesController.deleteProfile,

	createCollection: collectionsController.createCollection,
	getCollection: async ({ id }: { id: string }, context: { auth: IJWT}) => {
		if(id === "auto") {
			return await autoCollectionsController.createAutoCollection({}, context);
		} else if (id === "htm") {
			return await autoCollectionsController.createHardToMemorizeCollection({}, context);
		} else if (id === "interval") {
			return await autoCollectionsController.createIntervalCollection({}, context)
		} else {
			return await collectionsController.getCollection({ id }, context);
		}
	},
	getProfileCollections: collectionsController.getCollectionsByProfile,
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

	createRepetition: repetitionsController.createRepetition,
	getUserRepetitions: repetitionsController.getUserRepetitions
}

module.exports = root;