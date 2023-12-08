import { IUserSettings } from "@ts/settings";

import { openai, models } from "../../openai";
import globalErrorHandler from "../misc/globalErrorHandler";
import settingsController from "./Settings";
import { IContext } from "@ts-backend/context";

class AIGeneratedTextController {
	async generateText({ phrases }: { phrases: string[] }, context: IContext) {
		const userSettings = await settingsController.getUserSettings({ id: context.auth.userId });

		let completion;

		try {
			completion = await openai.chat.completions.create({
				messages: [
					{ role: "system", content: `You are a writer. You have the set of words. You need to write short text of maximum 300 characters. Text should include the words you received and be written in the same language as the words.${this._getDifficultyLevel(userSettings)} Return only the text without any additional information.`},
					{ role: "user", content: phrases.join(", ")}
				],
				model: userSettings.settings.useGPT3 ? models.gpt3 : models.gpt4
			})
		} catch(e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get response from chatGPT. ${e}`);
		}

		return completion.choices[0].message.content;
	}

	async generateSentences({ phrases }: { phrases: string[]}, context: IContext) {
		const userSettings = await settingsController.getUserSettings({ id: context.auth.userId });

		let completion;

		try {
			completion = await openai.chat.completions.create({
				messages: [
					{ role: "system", content: `You are a writer. You have the set of words. You need to write one sentence for each word that would include this word. Sentences must be written in the same language as the words. Your output must be formatted as an array of strings in JSON format.`},
					{ role: "user", content: phrases.join(", ")}
				],
				model: userSettings.settings.useGPT3 ? models.gpt3 : models.gpt4
			})
		} catch(e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get response from chatGPT. ${e}`);
		}

		return JSON.parse((completion.choices[0].message.content as string));
	}

	_getDifficultyLevel(userSettings: IUserSettings) {
		switch(userSettings.settings.textDifficulty) {
			case "simple": return " Also, the text must be simple and understandable for readers with A2 CEFR level."
			case "average": return " Also, the text must consist of commonly used vocabulary and be understandable for readers with B2 CEFR level."
			case "advanced": return " Also, the text must be advanced, written for readers with C1 CEFR level or native speakers."
			default: return ""
		}
	}
}

export default new AIGeneratedTextController();