import { fontColorFaint, nondescriptColor } from "@styles/variables";
import { IRepetitionStatsItem, IStatsDate, statsPeriodType } from "@ts/stats";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import EmptyColumn from "./EmptyColumn";
import ColumnIncrement from "./ColumnIncrement";

interface IProps { 
	dailyRepetitions: IRepetitionStatsItem[],
	date: IStatsDate,
	period: statsPeriodType
};

function RepeatedCollectionsDiagram({ dailyRepetitions, date, period }: IProps) {
	const [ scaleValues, setScaleValues ] = useState<string[]>([]);
	const [ itemHeight, setItemHeight ] = useState(1);

	useEffect(() => {
		let biggestValue = 0;

		dailyRepetitions.forEach((repetition) => {
			if(repetition.repeatedCollections > biggestValue) biggestValue = repetition.repeatedPhrases;
		});

		if(biggestValue <= 10) {
			setScaleValues(["0", "5", "10"]);
			setItemHeight(20);
		} else if (biggestValue <= 20) {
			setScaleValues(["0", "10", "20"]);
			setItemHeight(10);
		} else {
			setScaleValues(["0", "25", "50"])
			setItemHeight(4)
		}
	}, []);

	function renderColumns() {
		const columns = [];
		let columnDate = +date.from;


		console.log(JSON.stringify(dailyRepetitions, null, 2));

		if(period === "week") {
			for(let i = 0; i < 7; i++) {
				const columnData = dailyRepetitions.find((rep) => rep.date === columnDate);

				if(columnData) {
					const items = [];
					if(columnData.learningMethods.cards) items.push({ value: columnData.learningMethods.cards, color: "#799dea" });
					if(columnData.learningMethods.aiGeneratedText) items.push({ value: columnData.learningMethods.aiGeneratedText, color: "#f46256" });
					if(columnData.learningMethods.description) items.push({ value: columnData.learningMethods.description, color: "#71b671" });

					columns.push(<ColumnIncrement key={columnData.date} items={items} itemHeight={itemHeight} width={18} />);
				} else {
					columns.push(<EmptyColumn key={columnDate} width={18} />)
				}

				columnDate += 1000 * 60 * 60 * 24;
			}
		} else if (period = "month") {
			for(let i = 0; i < 30; i++) {
				const columnData = dailyRepetitions.find((rep) => rep.date === columnDate);

				if(columnData) {
					const items = [];
					if(columnData.learningMethods.cards) items.push({ value: columnData.learningMethods.cards, color: "#799dea" });
					if(columnData.learningMethods.aiGeneratedText) items.push({ value: columnData.learningMethods.aiGeneratedText, color: "#f46256" });
					if(columnData.learningMethods.description) items.push({ value: columnData.learningMethods.description, color: "#71b671" });

					columns.push(<ColumnIncrement key={columnData.date} items={items} itemHeight={itemHeight} />);
				} else {
					columns.push(<EmptyColumn key={columnDate} />)
				}

				columnDate += 1000 * 60 * 60 * 24;
			}
		}

		return columns;
	}

	return (
		<View style={styles.container}>
			<View style={styles.legend}>
				<View style={styles.legendItem}>
					<View style={{...styles.legendItemColor, backgroundColor: "#799dea"}} />
					<Text style={styles.legendItemName}>
						Cards
					</Text>
				</View>
				<View style={styles.legendItem}>
					<View style={{...styles.legendItemColor, backgroundColor: "#f46256"}} />
					<Text style={styles.legendItemName}>
						AI generated text
					</Text>
				</View>
				<View style={styles.legendItem}>
					<View style={{...styles.legendItemColor, backgroundColor: "#71b671"}} />
					<Text style={styles.legendItemName}>
						Description
					</Text>
				</View>
			</View>
			<View style={styles.main}>
				<View style={styles.asideScale}>
					{
						scaleValues.map((value) => <Text style={styles.asideScaleItem}>{value}</Text>)
					}
				</View>
				<View style={styles.body}>
					{renderColumns()}
				</View>
			</View>
			<View style={styles.bottomScale}>
				<Text style={styles.bottomScaleItem}>
					{moment(date.from).format("D MMM")}
				</Text>
				<Text style={styles.bottomScaleItem}>
					→
				</Text>
				<Text style={styles.bottomScaleItem}>
					{moment(date.to).format("D MMM")}
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: 320
	},
	main: {
		height: 200,
		flexDirection: "row"
	},
	bottomScale: {
		paddingLeft: 35,
		paddingRight: 10,
		height: 24,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	bottomScaleItem: {
		fontSize: 12,
		color: fontColorFaint
	},
	asideScale: {
		flexDirection: "column-reverse",
		width: 26,
		justifyContent: "space-between",
		alignItems: "center"
	},
	asideScaleItem: {
		fontSize: 10,
		color: fontColorFaint
	},
	body: {
		width: 288,
		borderColor: nondescriptColor,
		borderStyle: "solid",
		borderBottomWidth: 1,
		borderLeftWidth: 1,
		flexDirection: "row",
		justifyContent: "space-evenly"
	},
	legend: {
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		flexWrap: "wrap",
		rowGap: 5
	},
	legendItem: {
		height: 15,
		width: "30%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5
	},
	legendItemColor: {
		width: 15,
		height: 5,
		borderRadius: 5
	},
	legendItemName: {
		textAlign: "center",
		fontSize: 12,
		color: fontColorFaint
	}
})

export default RepeatedCollectionsDiagram;