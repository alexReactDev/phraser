import { fontColorFaint, nondescriptColor } from "@styles/variables";
import { IRepetitionStatsItem, IStatsDate, statsPeriodType } from "@ts/stats";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import EmptyColumn from "./EmptyColumn";
import Column from "./Column";

interface IProps { 
	dailyRepetitions: IRepetitionStatsItem[],
	date: IStatsDate,
	period: statsPeriodType
};

function RepeatedPhrasesDiagram({ dailyRepetitions, date, period }: IProps) {
	const [ scaleValues, setScaleValues ] = useState<string[]>([]);
	const [ itemHeight, setItemHeight ] = useState(1);

	useEffect(() => {
		let biggestValue = 0;

		dailyRepetitions.forEach((repetition) => {
			if(repetition.repeatedPhrases > biggestValue) biggestValue = repetition.repeatedPhrases;
		});

		if(biggestValue <= 100) {
			setScaleValues(["0", "50", "100"]);
			setItemHeight(2);
		} else if (biggestValue <= 200) {
			setScaleValues(["0", "100", "200"]);
			setItemHeight(1);
		} else {
			setScaleValues(["0", "200", "400"])
			setItemHeight(0.5)
		}
	}, []);

	function renderColumns() {
		const columns = [];
		let columnDate = +date.from;

		if(period === "week") {
			for(let i = 0; i < 7; i++) {
				const columnData = dailyRepetitions.find((rep) => rep.date === columnDate);
				if(columnData) {
					columns.push(<Column key={columnDate} value={columnData.repeatedPhrases} itemHeight={itemHeight} color="#e74c40" width={18} />)
				} else {
					columns.push(<EmptyColumn key={columnDate} width={18} />)
				}

				columnDate += 1000 * 60 * 60 * 24;
			}			
		} else if (period === "month") {
			for(let i = 0; i < 30; i++) {
				const columnData = dailyRepetitions.find((rep) => rep.date === columnDate);
				if(columnData) {
					columns.push(<Column key={columnDate} value={columnData.repeatedPhrases} itemHeight={itemHeight} color="#e74c40" />)
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
	}
})

export default RepeatedPhrasesDiagram;