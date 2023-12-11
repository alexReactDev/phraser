import { IRepetition, IRepetitionInput } from "@ts/repetitions";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
	result: Pick<IRepetition, "phrasesCount" | "repetitionsAmount" | "totalForgotten">
}

function Result({ result }: IProps) {
	const guessed = result.phrasesCount * result.repetitionsAmount;
	const steps = result.totalForgotten + guessed;
	const percentage = (guessed / steps * 100).toFixed(2);


	return (
		<View
			style={style.demoContainer}
		>
			<Text
				style={style.doneTitle}
			>
				Done! 🎉
			</Text>
			<Text
				style={style.resultTitle}
			>
				Your result
			</Text>
			<Text
				style={style.metaText}
			>
				Phrases count: {result.phrasesCount}
			</Text>
			<Text
				style={style.metaText}
			>
				Repetitions per word: {result.repetitionsAmount}
			</Text>
			<Text
				style={style.metaText}
			>
				Steps: {steps}
			</Text>
			<Text
				style={style.metaText}
			>
				Right answers: {guessed}
			</Text>
			<Text
				style={style.metaText}
			>
				Wrong answers: {result.totalForgotten}
			</Text>
			<Text
				style={style.metaText}
			>
				Right answers percentage: {percentage}%
			</Text>
		</View>
	)
}

const style = StyleSheet.create({
	demoContainer: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		gap: 8
	},
	doneTitle: {
		fontSize: 32,
		marginBottom: 20
	},
	resultTitle: {
		fontSize: 21,
		marginBottom: 15
	},
	metaText: {
		fontSize: 15
	}
})

export default Result;