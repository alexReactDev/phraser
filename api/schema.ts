const { buildSchema } = require("graphql");

const schema = buildSchema(`

	type PhraseMeta {
		repeated: Int,
		guessed: Int,
		forgotten: Int,
		lastRepetition: Int
	}

	type Phrase {
		id: ID,
		value: String,
		translation: String,
		created: Float,
		lastUpdate: Float,
		meta: PhraseMeta,
		profile: ID
	}

	type CollectionMeta {
		phrasesCount: Int,
		repetitionsCount: Int,
		lastRepetition: Int
	}

	type AutoGeneratedCollectionMeta {
		type: String
	}

	type Collection {
		id: ID,
		name: String,
		isLocked: Boolean,
		isAutoGenerated: Boolean,
		color: String,
		created: Float,
		lastUpdate: Float,
		profile: ID,
		meta: CollectionMeta,
		autoGeneratedCollectionMeta: AutoGeneratedCollectionMeta
		phrases: [ID],
		repetitions: [ID]
	}

	type PhraseRepetition {
		id: ID,
		guessed: Int,
		forgotten: Int,
		repeated: Int
	}

	type Repetition {
		id: ID,
		userId: ID,
		phrasesCount: Int,
		totalGuessed: Int,
		totalForgotten: Int,
		totalRepeated: Int,
		totalOmitted: Int,
		collectionName: String,
		repetitionType: String,
		phrasesRepetitions: [PhraseRepetition],
		omittedPhrases: [ID],
		created: Float
	}

	type Profile {
		id: ID,
		name: String,
		userId: ID
	}

	type Settings {
		theme: String,
		phrasesOrder: String,
		repetitionsAmount: Int,
		activeProfile: ID,
		autoCollectionSize: Int,
		intervalRepetitionDates: String
	}

	type UserSettings {
		id: ID,
		userId: ID,
		settings: Settings
	}

	type TokenData {
		token: String,
		sid: String,
		userId: String
	}

	type Session {
		sid: String,
		userId: String
	}

	type User {
		id: ID,
		name: String,
		login: String,
		created: Float
	}

	type Query {
		getCollection(id: ID): Collection,
		getProfileCollections(id: ID): [Collection],
		getCollectionPhrases(id: ID): [Phrase],
		getPhrase(id: ID): Phrase,
		getPhraseCollection(id: ID): Collection,
		getUserProfiles(id: ID): [Profile],
		getSession: Session,
		getUserSettings(id: ID): UserSettings,
		getUser(id: ID): User,
		getUserRepetitions(userId: ID): [Repetition]
	}

	input ProfileInput {
		name: String!,
		userId: ID!
	}

	input MutateProfileInput {
		name: String
	}

	input UserInput {
		name: String!,
		login: String!,
		password: String!,
	}

	input PhraseInput {
		value: String!,
		translation: String!
	}

	input CollectionInput {
		name: String!,
		color: String!,
		profile: ID!
	}

	input ChangeCollectionLockInput {
		isLocked: Boolean
	}

	input PhraseRepetitionInput {
		id: ID,
		guessed: Int,
		forgotten: Int,
		repeated: Int
	}

	input SettingsInput {
		theme: String!,
		phrasesOrder: String!,
		repetitionsAmount: String!,
		activeProfile: ID!
	}

	input PartialSettingsInput {
		theme: String,
		phrasesOrder: String,
		repetitionsAmount: Int,
		activeProfile: ID
	}

	input LoginInput {
		login: String!,
		password: String!
	}

	input SignUpInput {
		name: String!,
		login: String!,
		password: String!
	}

	input RepetitionInput {
		id: ID,
		userId: ID,
		phrasesCount: Int,
		totalGuessed: Int,
		totalForgotten: Int,
		totalRepeated: Int,
		totalOmitted: Int,
		collectionName: String,
		repetitionType: String,
		phrasesRepetitions: [PhraseRepetitionInput],
		omittedPhrases: [ID],
		created: Float
	}

	type Mutation {
		deletePhrase(id: ID): String,
		deleteCollection(id: ID): String,
		mutatePhrase(id: ID, input: PhraseInput, collection: ID): String,
		mutatePhrasesMeta(input: [PhraseRepetitionInput]): [Phrase],
		mutateCollection(id: ID, input: CollectionInput): String,
		changeCollectionLock(id: ID, input: ChangeCollectionLockInput): String,
		createPhrase(input: PhraseInput, collection: ID): Phrase,
		createCollection(input: CollectionInput): String,
		createUser(input: UserInput): String,
		createProfile(input: ProfileInput): String,
		mutateProfile(id: ID, input: MutateProfileInput): String,
		deleteProfile(id: ID): String
		updateUserSettings(id: ID, input: PartialSettingsInput): UserSettings,
		setUserSettings(id: ID, input: SettingsInput): String,
		login(input: LoginInput): TokenData,
		signUp(input: SignUpInput): TokenData,
		logout: String,
		deleteUser(id: ID): String,
		createRepetition(repetition: RepetitionInput): String,
		generateAutoCollection(type: String): Collection
	}
`);

module.exports = schema;