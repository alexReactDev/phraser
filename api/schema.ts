const { buildSchema } = require("graphql");

const schema = buildSchema(`

	type PhraseMeta {
		repeated: Int,
		guessed: Int,
		forgotten: Int
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
		repetitionsCount: Int
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
		meta: CollectionMeta
	}

	type Repetition {
		id: ID,
		phrasesCount: Int,
		totalGuessed: Int,
		totalForgotten: Int,
		totalRepeated: Int,
		phrasesRepetitions: [PhraseRepetition]
		created: Float
	}

	type PhraseRepetition {
		id: ID,
		guessed: Int,
		forgotten: Int,
		repeated: Int
	}

	type Query {
		getCollection(id: ID): Collection,
		getCollections: [Collection],
		getCollectionPhrases(id: ID): [Phrase],
		getPhrase(id: ID): Phrase,
		getPhraseCollection(id: ID): Collection
	}

	input PhraseInput {
		value: String!,
		translation: String!
	}

	input CollectionInput {
		name: String!,
		color: String!,
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

	type Mutation {
		deletePhrase(id: ID): [Phrase],
		deleteCollection(id: ID): String,
		mutatePhrase(id: ID, input: PhraseInput, collection: ID): Phrase,
		mutatePhrasesMeta(input: [PhraseRepetitionInput]): [Phrase],
		mutateCollection(id: ID, input: CollectionInput): String,
		changeCollectionLock(id: ID, input: ChangeCollectionLockInput): String,
		createPhrase(input: PhraseInput, collection: ID): Phrase,
		createCollection(input: CollectionInput): String,
		createCollectionRepetition(id: ID, input: RepetitionInput): Collection
	}
`);

module.exports = schema;