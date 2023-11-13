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
		meta: PhraseMeta
	}

	type CollectionMeta {
		phrasesCount: Int,
		repetitionsCount: Int,
		lastRepetition: Int
	}

	type Collection {
		id: ID,
		name: String,
		isLocked: Boolean,
		color: String,
		created: Float,
		lastUpdate: Float,
		phrases: [ID],
		repetitions: [ID],
		meta: CollectionMeta,
		profile: ID
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

	type PhraseRepetition {
		id: ID,
		guessed: Int,
		forgotten: Int,
		repeated: Int
	}

	type Profile {
		id: ID,
		name: String,
		userId: ID
	}

	type Settings {
		theme: String,
		phrasesOrder: String,
		repetitionsAmount: String,
		activeProfile: ID
	}

	type UserSettings {
		id: ID,
		userId: ID,
		settings: Settings
	}

	type TokenData {
		token: String,
		sid: Float,
		userId: Float
	}

	type Session {
		sid: Float,
		userId: Float
	}

	type User {
		id: Float,
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
		getUser(id: ID): User
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

	input RepetitionInput {
		phrasesCount: Int,
		totalGuessed: Int,
		totalForgotten: Int,
		totalRepeated: Int,
		phrasesRepetitions: [PhraseRepetitionInput]
		created: Float
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

	type Mutation {
		deletePhrase(id: ID): String,
		deleteCollection(id: ID): String,
		mutatePhrase(id: ID, input: PhraseInput, collection: ID): String,
		mutatePhrasesMeta(input: [PhraseRepetitionInput]): [Phrase],
		mutateCollection(id: ID, input: CollectionInput): String,
		changeCollectionLock(id: ID, input: ChangeCollectionLockInput): String,
		createPhrase(input: PhraseInput, collection: ID): Phrase,
		createCollection(input: CollectionInput): String,
		createCollectionRepetition(id: ID, input: RepetitionInput): Collection,
		createUser(input: UserInput): String,
		createProfile(input: ProfileInput): String,
		mutateProfile(id: ID, input: MutateProfileInput): String,
		deleteProfile(id: ID): String
		updateUserSettings(id: ID, input: PartialSettingsInput): UserSettings,
		setUserSettings(id: ID, input: SettingsInput): String,
		login(input: LoginInput): TokenData,
		signUp(input: SignUpInput): TokenData,
		logout: String,
		deleteUser(id: ID): String
	}
`);

module.exports = schema;