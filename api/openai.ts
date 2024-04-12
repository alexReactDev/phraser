import OpenAI from "openai";

export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

export const models = {
	gpt3: "gpt-3.5-turbo",
	gpt4: "gpt-4",
	dalle2: "dall-e-2",
	dalle3: "dall-e-3"
}