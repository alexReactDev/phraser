import { fontColorFaint, nondescriptColor } from "@styles/variables";
import { IStatsDate, IStatsItem, statsPeriodType } from "@ts/stats";
import moment from "moment";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import EmptyColumn from "./EmptyColumn";
import ColumnCover from "./ColumnCover";

interface IProps { 
	dailyStats: IStatsItem[],
	date: IStatsDate,
	period: statsPeriodType
};

function CreatedDiagram({ dailyStats, date, period }: IProps) {
	const [ scaleValues, setScaleValues ] = useState<string[]>([]);
	const [ itemHeight, setItemHeight ] = useState(1);

	useEffect(() => {
		let biggestValue = 0;

		dailyStats.forEach((repetition) => {
			if(repetition.createdPhrases > biggestValue) biggestValue = repetition.createdPhrases;
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
		let columnDay = date.from;

		if(period === "week") {
			for(let i = 0; i < 7; i++) {
				const columnData = dailyStats.find((stats) => stats.day === columnDay);

				if(columnData) {
					const items = [];

					if(columnData.createdPhrases > 0) items.push({ value: columnData.createdPhrases, color: "#799dea", zIndex: columnData.createdPhrases > columnData.createdCollections ? 1 : 2 });
					if(columnData.createdCollections > 0) items.push({ value: columnData.createdCollections, color: "#f46256", zIndex: columnData.createdCollections > columnData.createdPhrases ? 1 : 2 });

					columns.push(<ColumnCover key={columnDay} items={items} itemHeight={itemHeight} width={18} />);
				} else {
					columns.push(<EmptyColumn key={columnDay}  width={18} />)
				}

				columnDay++;
			}
		} else if (period = "month") {
			for(let i = 0; i < 30; i++) {
				const columnData = dailyStats.find((stats) => stats.day === columnDay);

				if(columnData) {
					const items = [];

					if(columnData.createdPhrases > 0) items.push({ value: columnData.createdPhrases, color: "#799dea", zIndex: columnData.createdPhrases > columnData.createdCollections ? 1 : 2 });
					if(columnData.createdCollections > 0) items.push({ value: columnData.createdCollections, color: "#f46256", zIndex: columnData.createdCollections > columnData.createdPhrases ? 1 : 2 });

					columns.push(<ColumnCover key={columnDay} items={items} itemHeight={itemHeight} />);
				} else {
					columns.push(<EmptyColumn key={columnDay} />)
				}

				columnDay++;
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
						Phrases
					</Text>
				</View>
				<View style={styles.legendItem}>
					<View style={{...styles.legendItemColor, backgroundColor: "#f46256"}} />
					<Text style={styles.legendItemName}>
						Collections
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
					{moment(date.from * 86400000).format("D MMM")}
				</Text>
				<Text style={styles.bottomScaleItem}>
					→
				</Text>
				<Text style={styles.bottomScaleItem}>
					{moment(date.to * 86400000).format("D MMM")}
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
		width: "50%",
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

export default CreatedDiagram;