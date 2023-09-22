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
		guessed: Int,
		forgotten: Int,
		created: Float
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
		name: String,
		isLocked: Boolean,
		color: String,
	}

	type Mutation {
		deletePhrase(id: ID): [Phrase],
		deleteCollection(id: ID): [Collection],
		createPhrase(input: PhraseInput, collection: ID): Phrase,
		mutatePhrase(id: ID, input: PhraseInput, collection: ID): Phrase,
		mutateCollection(id: ID, input: CollectionInput): Collection
	}
`);

module.exports = schema;