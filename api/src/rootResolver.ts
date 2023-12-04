import { IJWT } from "./types/authorization";

const collectionsController = require("./controller/Collections");
const phrasesController = require("./controller/Phrases");
const profilesController = require("./controller/Profiles");
const usersController = require("./controller/Users");
const authController = require("./controller/Authorization");
const settingsController = require("./controller/Settings");
const repetitionsController = require("./controller/Repetitions");
const autoCollectionsController = require("./controller/AutoCollections");
const AIGeneratedTextController = require("./controller/AIGeneratedText");

const root = {
	login: (...args: any) => authController.login(...args),
	signUp: (...args: any) => authController.signUp(...args),
	logout: (...args: any) => authController.logout(...args),
	getSession: (...args: any) => authController.getSession(...args),
	getUser: (...args: any) => usersController.getUser(...args),
	deleteUser: (...args: any) => usersController.deleteUser(...args),

	getUserSettings: (...args: any) => settingsController.getUserSettings(...args),
	setUserSettings: (...args: any) => settingsController.setUserSettings(...args),
	updateUserSettings: (...args: any) => settingsController.updateUserSettings(...args),

	createProfile: (...args: any) => profilesController.createProfile(...args),
	getUserProfiles: (...args: any) => profilesController.getUserProfiles(...args),
	mutateProfile: (...args: any) => profilesController.mutateProfile(...args),
	deleteProfile: (...args: any) => profilesController.deleteProfile(...args),

	createCollection: (...args: any) => collectionsController.createCollection(...args),
	generateAutoCollection: async ({ type }: { type: string }, context: { auth: IJWT}) => {
		if(type === "auto") {
			return await autoCollectionsController.createAutoCollection({}, context);
		} else if (type === "htm") {
			return await autoCollectionsController.createHardToMemorizeCollection({}, context);
		} else if (type === "interval") {
			return await autoCollectionsController.createIntervalCollection({}, context)
		} else {
			throw new Error("400. Bad request");
		}
	},
	getCollection: (...args: any) => collectionsController.getCollection(...args),
	getProfileCollections: (...args: any) => collectionsController.getCollectionsByProfile(...args),
	deleteCollection: (...args: any) => collectionsController.deleteCollection(...args),
	mutateCollection: (...args: any) => collectionsController.mutateCollection(...args),
	mutateCollectionMeta: (...args: any) => collectionsController.mutateCollectionMeta(...args),
	changeCollectionLock: (...args: any) => collectionsController.changeCollectionLock(...args),
	getPhraseCollection: (...args: any) => collectionsController.getCollectionByPhrase(...args),

	getPhrase: (...args: any) => phrasesController.getPhrase(...args),
	getCollectionPhrases: (...args: any) => phrasesController.getPhrasesByCollection(...args),
	createPhrase: (...args: any) => phrasesController.createPhrase(...args),
	mutatePhrase: (...args: any) => phrasesController.mutatePhrase(...args),
	mutatePhraseMeta: (...args: any) => phrasesController.mutatePhraseMeta(...args),
	movePhrase: (...args: any) => phrasesController.movePhrase(...args),
	movePhrasesMany: (...args: any) => phrasesController.moveMany(...args),
	deletePhrase: (...args: any) => phrasesController.deletePhrase(...args),
	deletePhrasesMany: (...args: any) => phrasesController.deleteMany(...args),

	createRepetition: (...args: any) => repetitionsController.createRepetition(...args),
	getUserRepetitions: (...args: any) => repetitionsController.getUserRepetitions(...args),

	getGeneratedText: (...args: any) => AIGeneratedTextController.generateText(...args),
	getGeneratedSentences: (...args: any) => AIGeneratedTextController.generateSentences(...args)
}

module.exports = root;