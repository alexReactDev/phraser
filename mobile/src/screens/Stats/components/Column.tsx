import { fontColorFaint } from "@styles/variables";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useClickOutside } from "react-native-click-outside";

interface IProps {
	value: number,
	itemHeight: number,
	color: string,
	width?: number
}

function Column({ value, itemHeight, width, color }: IProps) {
	const [ showValue, setShowValue ] = useState(false);
	const ref = useClickOutside<TouchableOpacity>(() => setShowValue(false));
	
	const definedWidth = width || 9.8;
	const height = value * itemHeight;

	return (
		<TouchableOpacity
			style={{ ...styles.container, width: definedWidth }}
			activeOpacity={0.5}
			onPress={() => setShowValue(!showValue)}
			ref={ref}
		>
			<View style={{ backgroundColor: color, height: height }}>
				<View style={{ ...styles.columnValueContainer, width: definedWidth + 10 }}>
					<Text style={{ ...styles.columnValue, display: showValue ? "flex" : "none"}}>
						{value}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 200,
		justifyContent: "flex-end"
	},
	column: {
		position: "relative"
	},
	columnValueContainer: {
		height: 15,
		position: "absolute",
		top: -15,
		left: -5,
		justifyContent: "center",
		alignItems: "center"
	},
	columnValue: {
		color: fontColorFaint,
		fontSize: 8
	}
})

export default Column;