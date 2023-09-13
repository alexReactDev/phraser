const { buildSchema } = require("graphql");

const schema = buildSchema(`

	type Phrase {
		id: ID,
		value: String,
		translation: String,
		created: Int,
		lastUpdate: Int,
		meta: {
			repeated: Int,
			guessed: Int,
			forgotten: Int
		}
	}

	type Collection {
		id: ID,
		name: String,
		isLocked: Boolean,
		color: String,
		created: Int,
		lastUpdate: Int,
		phrases: [ID],
		repetitions: [ID],
		meta: {
			phrasesCount: Int,
			repetitionsCount: Int
		}
	}

	type Repetition {
		id: ID,
		phrasesCount: Int,
		guessed: Int,
		forgotten: Int
	}

`);

module.exports = schema;