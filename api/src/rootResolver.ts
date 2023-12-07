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
import globalErrorHandler from "./misc/globalErrorHandler";
import db from "./model/db";
import { IChangeCollectionLockInput, ICollectionInput, ICollectionMetaInput } from "@ts-backend/collections";
import { IPhraseInput, IPhraseRepetitionInput } from "@ts-backend/phrases";
import { IProfileInput } from "@ts-backend/profiles";
import { IRepetitionInput } from "@ts/repetitions";
import { ISettings } from "@ts/settings";
import { IntervalRepetitionDatesValues, PhrasesOrderValues, TextDifficultyValues } from "./types/settingsValues";

const root = {
	login: authController.login,
	signUp: authController.signUp.bind(authController),
	getSession: authController.getSession.bind(authController),
	logout: async (params: {}, context: { auth: IJWT }) => {
		if(!context.auth) return "OK";

		return await authController.logout(params, context);
	},

	
	getUser: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.id !== context.auth.userId) throw new Error("403. Access denied");

		return await usersController.getUser(params);
	},

	deleteUser: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.id !== context.auth.userId) throw new Error("403. Access denied");

		return await usersController.deleteUser(params);
	},

	getUserSettings: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.id !== context.auth.userId) throw new Error("403. Access denied");

		console.log("Settings loading");

		return await settingsController.getUserSettings(params);
	},

	setUserSettings: async (params: { id: string, input: ISettings}, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.id !== context.auth.userId) throw new Error("403. Access denied");

		const profile = await profilesController.getProfile({ id: params.input.activeProfile });

		if(profile.userId !== context.auth.userId) throw new Error("403. Access denied");

		if(!PhrasesOrderValues.includes(params.input.phrasesOrder)) throw new Error("400. Bad request - unacceptable phrases order value");
		if(!IntervalRepetitionDatesValues.includes(params.input.intervalRepetitionDates)) throw new Error("400. Bad request - unacceptable interval repetition dates value");
		if(!TextDifficultyValues.includes(params.input.textDifficulty)) throw new Error("400. Bad request - unacceptable text difficulty value");

		return await settingsController.setUserSettings(params);
	},


	updateUserSettings: async (params: { id: string, input: Partial<ISettings>}, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.id !== context.auth.userId) throw new Error("403. Access denied");

		let count = 0;

		for (let key in params.input) {
			count++;
		}

		if(count === 0) throw new Error("400. Bad request - received empty settings object");

		if(params.input.activeProfile) {
			const profile = await profilesController.getProfile({ id: params.input.activeProfile });
	
			if(profile.userId !== context.auth.userId) throw new Error("403. Access denied");
		}

		if(params.input.phrasesOrder && !PhrasesOrderValues.includes(params.input.phrasesOrder)) throw new Error("400. Bad request - unacceptable phrases order value");
		if(params.input.intervalRepetitionDates && !IntervalRepetitionDatesValues.includes(params.input.intervalRepetitionDates)) throw new Error("400. Bad request - unacceptable interval repetition dates value");
		if(params.input.textDifficulty && !TextDifficultyValues.includes(params.input.textDifficulty)) throw new Error("400. Bad request - unacceptable text difficulty value");

		return settingsController.updateUserSettings(params);
	},

	createProfile: async (params: { input: IProfileInput }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.input.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await profilesController.createProfile(params);
	},


	getUserProfiles: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.id !== context.auth.userId) throw new Error("403. Access denied");

		return await profilesController.getUserProfiles(params);
	},


	mutateProfile: async (params: { id: string, input: { name: string }}, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const profile = await profilesController.getProfile({ id: params.id });

		if(profile.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await profilesController.mutateProfile(params);
	},

	deleteProfile: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const profile = await profilesController.getProfile({ id: params.id });

		if(profile.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await profilesController.deleteProfile(params);
	},

	createCollection: async (params: { input: ICollectionInput }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		let profile = await profilesController.getProfile({ id: params.input.profile });

		if(profile.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await collectionsController.createCollection(params, context);
	},
	generateAutoCollection: async ({ type }: { type: string }, context: { auth: IJWT}) => {
		if(!context.auth) throw new Error("401. Authorization required");

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
	getCollection: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const collection = await collectionsController.getCollection(params);

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return collection;
	},
	getProfileCollections: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		let profile = await profilesController.getProfile({ id: params.id });

		if(profile.userId !== context.auth.userId) throw new Error("403. Access denied");

		return collectionsController.getCollectionsByProfile(params);
	},
	
	deleteCollection: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		let collection = await collectionsController.getCollection(params);

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await collectionsController.deleteCollection(params);
	},

	
	mutateCollection: async (params: { id: string, input: ICollectionInput}, context: { auth: IJWT }) => {
		console.log("COL1")
		if(!context.auth) throw new Error("401. Authorization required");

		let collection = await collectionsController.getCollection(params);
		console.log("COL2")
		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");
		console.log("COL3")
		return await collectionsController.mutateCollection(params);
	},

	mutateCollectionMeta: async (params: { id: string, input: ICollectionMetaInput }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		let collection = await collectionsController.getCollection(params);

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await collectionsController.mutateCollectionMeta(params);
	},

	
	changeCollectionLock: async (params: { id: string, input: IChangeCollectionLockInput }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		let collection = await collectionsController.getCollection(params);

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await collectionsController.changeCollectionLock(params);
	},

	
	getPhraseCollection: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const collection = await collectionsController.getCollectionByPhrase(params);

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return collection;
	},

	getPhrase: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const phrase = await phrasesController.getPhrase(params);

		if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");

		return phrase;
	},

	getCollectionPhrases: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const collection = await collectionsController.getCollection({ id: params.id });

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await phrasesController.getPhrasesByCollection(params);
	},
	
	createPhrase: async (params: { input: IPhraseInput, collection: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const collection = await collectionsController.getCollection({ id: params.collection });

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await phrasesController.createPhrase(params, context);
	},

	
	mutatePhrase: async (params: { id: string, input: IPhraseInput }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const phrase = await phrasesController.getPhrase({ id: params.id });

		if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");

		return phrasesController.mutatePhrase(params);
	},

	mutatePhraseMeta: async (params: { id: string, input: IPhraseRepetitionInput }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const phrase = await phrasesController.getPhrase({ id: params.id });

		if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");

		return phrasesController.mutatePhraseMeta(params);
	},

	
	movePhrase: async (params: { id: string, destId: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const phrase = await phrasesController.getPhrase({ id: params.id });

		if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");

		const collection = await collectionsController.getCollection({ id: params.destId });

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await phrasesController.movePhrase(params);
	},

	movePhrasesMany: async (params: { ids: string[], destId: string}, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.ids.length === 0) throw new Error("400. Received empty phrases array");

		let phrases;

		try {
			const cursor = await db.collection("phrases").find({
				id: {
					$in: params.ids
				}
			});

			phrases = await cursor.toArray();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get phrases ${e.toString()}`);
		}

		if(phrases.length < params.ids.length) throw new Error("400. Bad request - all or some phrases not found");

		for(let phrase of phrases) {
			if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");
		}

		const collection = await collectionsController.getCollection({ id: params.destId });

		if(collection.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await phrasesController.moveMany(params);
	},

	deletePhrase: async (params: { id: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		const phrase = await phrasesController.getPhrase({ id: params.id });

		if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await phrasesController.deletePhrase(params);
	},
	
	deletePhrasesMany: async (params: { ids: string[] }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.ids.length === 0) throw new Error("400. Received empty phrases array");

		let phrases;

		try {
			const cursor = await db.collection("phrases").find({
				id: {
					$in: params.ids
				}
			});

			phrases = await cursor.toArray();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get phrases ${e.toString()}`);
		}

		if(phrases.length < params.ids.length) throw new Error("400. Bad request - all or some phrases not found");

		for(let phrase of phrases) {
			if(phrase.userId !== context.auth.userId) throw new Error("403. Access denied");
		}

		return phrasesController.deleteMany(params);
	},

	createRepetition: async (params: { input: IRepetitionInput }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.input.userId !== context.auth.userId) throw new Error("403. Access denied");

		if(
			params.input.phrasesCount === 0 
			|| params.input.repetitionsAmount === 0 
			|| params.input.phrasesRepetitions.length === 0
		) throw new Error("400. Bad request - received empty repetition");

		return await repetitionsController.createRepetition(params);
	},

	getUserRepetitions: async (params: { userId: string }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		if(params.userId !== context.auth.userId) throw new Error("403. Access denied");

		return await repetitionsController.getUserRepetitions(params);
	},

	getGeneratedText: async (params: { phrases: string[] }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		let premium;

		try {
			premium = await db.collection("premium").findOne({
				userId: context.auth.userId
			})
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get premium information ${e.toString()}`);
		}

		if(!premium) throw new Error("403. Access denied - premium subscription is required");

		if(params.phrases.length === 0) throw new Error("400. Bad request - phrases array is empty");

		return await AIGeneratedTextController.generateText(params, context);
	},
	getGeneratedSentences: async (params: { phrases: string[] }, context: { auth: IJWT }) => {
		if(!context.auth) throw new Error("401. Authorization required");

		let premium;

		try {
			premium = await db.collection("premium").findOne({
				userId: context.auth.userId
			})
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get premium information ${e.toString()}`);
		}

		if(!premium) throw new Error("403. Access denied - premium subscription is required");

		if(params.phrases.length === 0) throw new Error("400. Bad request - phrases array is empty");

		return await AIGeneratedTextController.generateSentences(params, context);
	}
}

export default root;