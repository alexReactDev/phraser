//@ts-nocheck

import { IJWT } from "./types/authorization";

import collectionsController from "./controller/Collections";
import phrasesController from "./controller/Phrases";
import profilesController from "./controller/Profiles";
import usersController from "./controller/Users";
import authController from "./controller/Authorization";
import settingsController from "./controller/Settings";
import repetitionsController from "./controller/Repetitions";
import autoCollectionsController from "./controller/AutoCollections";
import AIGeneratedTextController from "./controller/AIGeneratedText";

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

export default root;