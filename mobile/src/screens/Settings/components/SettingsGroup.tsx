import { borderColor, fontColor } from "@styles/variables";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
	children: React.ReactNode,
	title: string
}

function SettingsGroup({ title, children }: IProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{title}
			</Text>
			{children}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		margin: 10,
		padding: 10,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: borderColor,
		borderRadius: 5,
		backgroundColor: "#fefefe"
	},
	title: {
		fontSize: 21,
		color: fontColor,
		marginBottom: 10
	},
})

export default SettingsGroup;