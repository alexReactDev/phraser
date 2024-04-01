import { fontColor, fontColorFaint, nondescriptColor } from "@styles/variables";
import { IRepetition } from "@ts/repetitions";
import moment from "moment";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { default as commonStyles } from "../styles/styles";

function Repetition({ repetition }: { repetition: IRepetition}) {
	const [ showDetails, setShowDetails ] = useState(false);

	const date = moment(repetition.created as number).format("DD.MM.YYYY");
	const guessed = repetition.phrasesCount * repetition.repetitionsAmount;
	const steps = repetition.totalForgotten + guessed;
	const percentage = +(guessed / steps * 100).toFixed(2);

	return (
		<TouchableOpacity 
			style={styles.container}
			activeOpacity={0.7}
			onPress={() => setShowDetails(!showDetails)}
		>
			<View style={styles.header}>
				<View style={styles.headerTitles}>
					<Text style={styles.headerTitle}>
						{repetition.repetitionType}
					</Text>
					<Text style={styles.headerSubtitle}>
						{repetition.collectionName}
					</Text>
				</View>
				<Text style={styles.headerDate}>
					{date}
				</Text>
			</View>
			<View style={{...styles.body, display: showDetails ? "flex" : "none"}}>
				<View style={styles.row}>
					<Text style={styles.rowName}>
						Phrases count:
					</Text>
					<Text style={styles.rowValue}>
						{repetition.phrasesCount}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowName}>
						Repetitions per word:
					</Text>
					<Text style={styles.rowValue}>
						{repetition.repetitionsAmount}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowName}>
						Steps:
					</Text>
					<Text style={styles.rowValue}>
						{steps}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowName}>
						Right answers:
					</Text>
					<Text style={styles.rowValue}>
						{guessed}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowName}>
						Wrong answers:
					</Text>
					<Text style={styles.rowValue}>
						{repetition.totalForgotten}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowName}>
						Right answers percentage:
					</Text>
					<Text style={styles.rowValue}>
						{percentage}%
					</Text>
				</View>
			</View>
		</TouchableOpacity>	
	)
}

const styles = {
	...commonStyles,
	...StyleSheet.create({
		container: {
			borderStyle: "solid",
			borderColor: nondescriptColor,
			borderWidth: 1,
			borderRadius: 5,
			paddingVertical: 5,
			paddingHorizontal: 8,
			backgroundColor: "#f5f5f5"
		},
		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center"
		},
		headerTitles: {
	
		},
		headerTitle: {
			marginBottom: 2,
			fontSize: 17,
			color: fontColor
		},
		headerSubtitle: {
			fontSize: 15,
			color: "grey"
		},
		headerDate: {
			color: "grey"
		},
		body: {
			marginTop: 10,
			borderColor: nondescriptColor,
			borderStyle: "solid",
			borderTopWidth: 1,
			paddingVertical: 8,
			paddingHorizontal: 10,
			gap: 4
		},
		rowName: {
			...commonStyles.rowName,
			fontSize: 14
		},
		rowValue: {
			...commonStyles.rowValue,
			width: "20%",
			fontSize: 14,
			textAlign: "center"
		}
	})
}

export default Repetition;