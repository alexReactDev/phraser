import { openai, models } from "../../openai";
import globalErrorHandler from "../misc/globalErrorHandler";

class AIGeneratedImagesController {
	async getAIGeneratedImage({ phrase }: { phrase: string }) {
		let link;

		try {
			const res = await openai.images.generate({
				prompt: `${phrase}`,
				model: models.dalle2,
				size: "256x256",
				response_format: "url"
			});

			link = res.data[0].url;
		} catch(e) {
			globalErrorHandler(e);
			throw new Error(`Server error. Failed to get response from chatGPT. ${e}`);
		}

		return {
			url: link
		};
	}
}

export default new AIGeneratedImagesController();