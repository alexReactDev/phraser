import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from "react-native";
import { fontColorFaint, nondescriptColor } from '../../../styles/variables';

function NoCollections() {
	return (
		<View style={style.container}>
			<View style={style.iconContainer}>
				<MaterialCommunityIcons name="folder-remove-outline" size={96} color={nondescriptColor} />
			</View>
			<Text style={style.text}>
				No collections
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

export default NoCollections;