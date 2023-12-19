import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../Collections";

type TNavigation = StackNavigationProp<StackNavigatorParams, "Collection", "collectionsNavigator">

function LearnButton({ colId, color, navigation }: { colId: string, color: string, navigation: TNavigation }) {
	return (
		<TouchableOpacity style={{...style.container, backgroundColor: color}}
			activeOpacity={0.7}
			onPress={() => navigation.navigate("Learn", { colId })}
		>
			<View style={style.body}>
				<Text style={style.text}>
					Learn
				</Text>
				<Ionicons name="book" size={21} color="white" style={style.icon} />
			</View>
		</TouchableOpacity>
	)
}

const style = StyleSheet.create({
	container: {
		zIndex: 1,
		position: "absolute",
		width: "90%",
		height: 45,
		bottom: 20,
		alignSelf: "center",
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center"
	},
	body: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 10
	},
	text: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold"
	},
	icon: {
		marginBottom: -2
	}
});

export default LearnButton;