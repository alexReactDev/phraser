const OpenAI = require("openai");

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

const models = {
	gpt3: "gpt-3.5-turbo",
	gpt4: "gpt-4"
}

module.exports = {
	openai,
	models
};