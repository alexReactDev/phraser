import { StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";

interface IProps {
	total: number,
	progress: number
}

function ProgressBar({ total, progress }: IProps) {
	return (
	<View
		style={style.container}
	>
		<Progress.Bar
			width={200}
			height={12}
			unfilledColor="lightgray"
			progress={progress / total}
			color="gray"
		></Progress.Bar>
		<Text>
			{`${progress}/${total}`}
		</Text>
	</View>
	)
}

const style = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
		alignItems: "center"
	}
})

export default ProgressBar;