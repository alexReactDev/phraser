import { v4 } from "uuid";
import globalErrorHandler from "../misc/globalErrorHandler";
import { IContext } from "@ts-backend/context";
import SettingsController from "./Settings";

class TranslationController {
	async getTranslatedText({ input }: { input: string }, context: IContext) {
		const settings = await SettingsController.getUserSettings({ id: context.auth.userId });

		const params = new URLSearchParams();
		params.append("api-version", "3.0");
		params.append("to", settings.settings.suggestionsLanguage);

		let result;

		try {
			const res = await fetch(`https://api.cognitive.microsofttranslator.com/translate?${params.toString()}`, {
				method: "post",
				//@ts-ignore typescript doesn't recognize azure headers
				headers: {
					'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATOR_API_KEY,
					'Content-type': 'application/json',
					'X-ClientTraceId': v4().toString(),
					'Accept': 'application/json'
				},
				body: JSON.stringify([{
					text: input
				}])
				
			});

			if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);

			result = await res.json();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to connect translator api ${e}`);
		}

		return result[0].translations[0].text;
	}

	async getSupportedLanguages() {
		const params = new URLSearchParams();
		params.append("api-version", "3.0");

		let result;

		try {
			const res = await fetch(`https://api.cognitive.microsofttranslator.com/languages?${params.toString()}`);

			if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);

			result = await res.json();
		} catch (e: any) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to connect translator api ${e}`);
		}

		const languagesArray = [];

		for (let key in result.translation) {
			languagesArray.push({
				value: key,
				name: result.translation[key].name
			})
		}

		return languagesArray;
	}
}

export default new TranslationController();