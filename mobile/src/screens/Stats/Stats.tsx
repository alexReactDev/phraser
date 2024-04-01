import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import StatsByPeriod from "./components/StatsByPeriod";
import OtherStats from "./components/OtherStats";
import RepetitionsHistory from "./components/ReptitionsHistory";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import { fontColorFaint } from "@styles/variables";
import { statsPeriodType } from "@ts/stats";

const statsPeriods = [
	{ name: "Weekly", value: "week" },
	{ name: "Monthly", value: "month" }
]

function Stats() {
	const [ period, setPeriod ] = useState<statsPeriodType>("week");

	return (
		<ScrollView style={styles.container}>
			<View style={styles.topMenuContainer}>
				<Text style={styles.topMenuTitle}>
					Period:
				</Text>
				<SelectDropdown
					data={statsPeriods}
					onSelect={(selectedItem) => setPeriod(selectedItem.value)}
					rowTextForSelection={(item) => item.name}
					buttonTextAfterSelection={(item) => item.name}
					defaultValueByIndex={0}
					renderDropdownIcon={() => <Ionicons name="caret-down" size={16} color="gray" />}
					buttonStyle={styles.select}
					buttonTextStyle={styles.selectText}
					rowStyle={styles.selectItem}
					rowTextStyle={styles.selectItemText}
				/>
			</View>
			<StatsByPeriod period={period} />
			<OtherStats />
			<RepetitionsHistory />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10
	},
	topMenuContainer: {
		marginBottom: 15,
		paddingHorizontal: 10,
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
	},
	topMenuTitle: {
		color: fontColorFaint,
		fontSize: 17
	},
	select: {
		height: 30,
		width: 120,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 4,
		backgroundColor: "#f9f9f9"
	},
	selectText: {
		color: "gray",
		fontSize: 15
	},
	selectItem: {
		height: 40
	},
	selectItemText: {
		fontSize: 15
	}
})

export default Stats;