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
		getCollections: [Collection]
	}
`);

module.exports = schema;