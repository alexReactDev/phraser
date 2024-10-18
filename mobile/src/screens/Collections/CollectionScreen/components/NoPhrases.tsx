import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";
import { fontColorFaint, nondescriptColor } from '../../../../styles/variables';

function NoPhrases() {
	return (
		<View style={style.container}>
			<View style={style.iconContainer}>
				<MaterialCommunityIcons name="file-document-multiple-outline" size={96} color={"#888"} />
			</View>
			<Text style={style.text}>
				No phrases
			</Text>
		</View>
	)
}

const style = StyleSheet.create({
	container: {
		marginVertical: 32
	},
	iconContainer: {
		alignItems: "center",
		marginBottom: 12
	},
	text: {
		textAlign: "center",
		fontSize: 18,
		color: fontColorFaint
	}
})

export default NoPhrases;