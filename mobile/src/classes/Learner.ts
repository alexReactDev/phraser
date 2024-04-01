import { MUTATE_COLLECTION_META } from "@query/collections";
import { MUTATE_PHRASE_META } from "@query/phrases";
import { CREATE_REPETITION } from "@query/repetitions";
import { IRepetitionInput } from "@ts/repetitions";
import { client } from "src/apollo";

class Learner {
	async _updateCollectionMeta(id: string) {
		await client.mutate({
			mutation: MUTATE_COLLECTION_META,
			variables: {
				id,
				input: {
					repetitionsCount: 1,
					lastRepetition: new Date().getTime()
				}
			}
		})
	}

	async _updatePhraseMeta(id: string, remembered: boolean) {
		await client.mutate({
			mutation: MUTATE_PHRASE_META,
			variables: {
				id,
				input: {
					guessed: remembered ? 1 : 0,
					forgotten: remembered ? 0 : 1,
					lastRepetition: new Date().getTime()
				}
			}
		})
	}

	async _createRepetition(repetition: IRepetitionInput) {
		try {
			await client.mutate({
				mutation: CREATE_REPETITION,
				variables: { input: repetition }
			})
		} catch(e: any) {
			console.log(`Failed to save repetition data ${e}`);
			for(let key in e) {
				console.log(key);
				console.log(e[key]);
			}
			console.log(e.networkError)
			for(let key in e.networkError) {
				console.log(key);
				console.log(e[key]);
			}
		}
	}
}

export default Learner;