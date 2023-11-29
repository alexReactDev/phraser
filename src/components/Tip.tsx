import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { nondescriptColor } from "@styles/variables";
import { useState } from "react";
import { useClickOutside } from "react-native-click-outside";

function Tip({ text }: { text: string }) {
	const [ showTooltip, setShow ] = useState(true);
	const ref = useClickOutside(() => setShow(false));

	return (
		<View style={styles.container} ref={ref}>
			{
				showTooltip &&
				<View style={styles.tooltip}>
					<Text style={styles.text}>
						{text}
					</Text>
				</View>
			}
			<TouchableOpacity
				onPress={() => setShow(!showTooltip)}
			>
				<Ionicons name="help-circle-outline" size={22} color="grey" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		width: 22,
		height: 22,
		zIndex: 1
	},
	tooltip: {
		position: "absolute",
		width: 200,
		bottom: 24,
		left: -88,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: nondescriptColor,
		padding: 5,
		backgroundColor: "white",
		zIndex: 1
	},
	text: {
		textAlign: "center",
		fontSize: 13,
		color: "gray"
	}
})

export default Tip;