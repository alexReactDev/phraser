import { fontColor, fontColorFaint } from "@styles/variables";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useClickOutside } from "react-native-click-outside";

interface IProps {
	items: { value: number, color: string, zIndex: number }[],
	itemHeight: number,
	width?: number
}

function ColumnCover({ items, itemHeight, width }: IProps) {
	const [ showValue, setShowValue ] = useState(false);
	const ref = useClickOutside<TouchableOpacity>(() => setShowValue(false));
	
	const definedWidth = width || 9.8;
	
	return (
		<TouchableOpacity
			style={{ ...styles.container, width: definedWidth }}
			activeOpacity={0.5}
			onPress={() => setShowValue(!showValue)}
			ref={ref}
		>
			{
				items.map((item) => {
					const height = item.value * itemHeight;
					return (
						<View style={{...styles.column, height, backgroundColor: item.color, zIndex: item.zIndex }}>
							<View style={{ ...styles.columnValueContainer, width: definedWidth + 10 }}>
								<Text style={{ ...styles.columnValue, display: showValue ? "flex" : "none"}}>
									{item.value}
								</Text>
							</View>
						</View>
					)
				})
			}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 200,
		justifyContent: "flex-end",
		position: "relative"
	},
	column: {
		position: "absolute",
		left: 0,
		bottom: 0,
		width: "100%"
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
		color: fontColor,
		fontSize: 8
	}
})

export default ColumnCover;