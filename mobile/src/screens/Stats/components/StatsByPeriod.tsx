import { IStats, statsPeriodType } from "@ts/stats";
import { StyleSheet, Text, View } from "react-native";
import { default as commonStyles } from "../styles/styles";
import { fontColor, nondescriptColor } from "@styles/variables";
import { observer } from "mobx-react-lite";
import { useQuery } from "@apollo/client";
import { GET_STATS_BY_PERIOD } from "@query/stats";
import settings from "@store/settings";
import Loader from "@components/Loaders/Loader";
import ErrorComponent from "@components/Errors/ErrorComponent";
import RepeatedPhrasesDiagram from "./RepeatedPhrasesDiagram";
import RepeatedCollectionsDiagram from "./RepeatedCollectionsDiagram";
import CreatedDiagram from "./CreatedDiagram";

const StatsByPeriod = observer(function({ period }: { period: statsPeriodType }) {
	const to = Math.trunc(new Date().getTime() / 86400000);
	const from = period === "week" ? to - 7 : to - 30;

	const { data, loading, error } = useQuery(GET_STATS_BY_PERIOD, { variables: { 
		profileId: settings.settings.activeProfile,
		from,
		to
	}});
	
	if(loading) return <Loader />
	if(error) return <ErrorComponent message="Failed to load data for the period" />
	
	const stats: IStats = data.getStatsByPeriod;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{
					period === "week"
					?
					"Weekly stats"
					:
					"Monthly stats"
				}
			</Text>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>
					Created
				</Text>
				<View style={styles.diagramContainer}>
					<CreatedDiagram dailyStats={stats.dailyStats} date={stats.date} period={period} />
				</View>
				<View style={styles.cardBody}>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Phrases total:
						</Text>
						<Text style={styles.rowValue}>
							{stats.createdPhrasesTotal}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Average per day:
						</Text>
						<Text style={styles.rowValue}>
							{stats.createdPhrasesAverage > 0 ? stats.createdPhrasesAverage : "less than one"}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Collections total:
						</Text>
						<Text style={styles.rowValue}>
							{stats.createdCollectionsTotal}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Average per day:
						</Text>
						<Text style={styles.rowValue}>
							{stats.createdCollectionsAverage > 0 ? stats.createdCollectionsAverage : "less than one"}
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>
					Repeated phrases
				</Text>
				<View style={styles.diagramContainer}>
					<RepeatedPhrasesDiagram dailyRepetitions={stats.dailyRepetitions} date={stats.date} period={period} />
				</View>
				<View style={styles.cardBody}>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Total:
						</Text>
						<Text style={styles.rowValue}>
							{stats.repeatedPhrasesTotal}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Average per day:
						</Text>
						<Text style={styles.rowValue}>
							{stats.repeatedPhrasesAverage > 0 ? stats.repeatedPhrasesAverage : "less than one"}
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.card}>
				<Text style={styles.cardTitle}>
					Repeated collections
				</Text>
				<View style={styles.diagramContainer}>
					<RepeatedCollectionsDiagram dailyRepetitions={stats.dailyRepetitions} date={stats.date} period={period} />
				</View>
				<View style={styles.cardBody}>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Total:
						</Text>
						<Text style={styles.rowValue}>
							{stats.repeatedCollectionsTotal}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Average per day:
						</Text>
						<Text style={styles.rowValue}>
							{stats.repeatedCollectionsAverage > 0 ? stats.repeatedCollectionsAverage : "less than one"}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Right answers:
						</Text>
						<Text style={styles.rowValue}>
							{stats.rightAnswersAveragePercentage}%
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Favorite learning method:
						</Text>
						<Text style={styles.rowValue}>
							{stats.favoriteLearningMethod}
						</Text>
					</View>
				</View>
			</View>
			<View style={{...styles.card, marginBottom: 0 }}>
				<Text style={styles.cardTitle}>
					Activity
				</Text>
				<View style={styles.cardBody}>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Visited:
						</Text>
						<Text style={styles.rowValue}>
							{`${stats.visitedDays} day(s) / ${period === "week" ? (stats.visitedDays / 7 * 100).toFixed(2) : (stats.visitedDays / 30 * 100).toFixed(2)}%`}
						</Text>
					</View>
				</View>
			</View>
		</View>
	)
})

const styles = {
	...commonStyles,
	...StyleSheet.create({
		container: {
			...commonStyles.container,
			marginBottom: 15
		},
		card: {
			marginBottom: 15,
			borderStyle: "solid",
			borderColor: nondescriptColor,
			borderWidth: 1,
			borderRadius: 12,
			paddingVertical: 8,
			backgroundColor: "#fefefe"
		},
		cardTitle: {
			marginBottom: 10,
			paddingHorizontal: 10,
			fontSize: 17,
			color: fontColor
		},
		cardBody: {
			paddingHorizontal: 12,
			gap: 8
		},
		diagramContainer: {
			marginBottom: 15,
			flexDirection: "row",
			justifyContent: "center"
		},
		placeholder: {
			height: 200,
			width: 300,
			backgroundColor: "lightyellow"
		}
	})
}

export default StatsByPeriod;