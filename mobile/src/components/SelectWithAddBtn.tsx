import { fontColor } from "@styles/variables";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import React from "react";

interface ISelectItem {
	id: string,
	name: string,
	[key: string]: any
}

interface IProps {
	data: ISelectItem[],
	onSelect: (id: string) => void,
	onAdd: () => void
}

const SelectWithAddBtn = React.forwardRef<any, any>(function ({ data, onSelect, onAdd }: IProps, ref) {
	return (
		<SelectDropdown
			data={data}
			ref={ref}
			onSelect={(selectedItem) => onSelect(selectedItem.id)}
			buttonTextAfterSelection={(item) => item.name}
			defaultButtonText="Select collection"
			buttonStyle={styles.select}
			buttonTextStyle={styles.selectText}
			renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color="gray" />}
			renderCustomizedRowChild={(item) => {
				if(item.id !== "CREATE") {
					return (
						<View style={styles.selectItem}>
							<Text style={styles.selectItemText}>
								{item.name}
							</Text>
						</View>
					)
				} else {
					return (
						<TouchableOpacity style={styles.selectItem}
							onPress={(e) => {
								e.stopPropagation();
								onAdd();
							}}
						>
							<Ionicons name="add" size={28} color="gray" />
						</TouchableOpacity>
					)
				}
			}}
		></SelectDropdown>
	)
});

const styles = StyleSheet.create({
	select: {
		width: "100%",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "#bbb",
		marginTop: 15,
		borderRadius: 12,
		height: 47,
		backgroundColor: "#f9f9f9f5"
	},
	selectText: {
		color: "gray"
	},
	selectItem: {
		flexDirection: "row",
		justifyContent: "center"
	},
	selectItemText: {
		fontSize: 16,
		color: fontColor
	}
})

export default SelectWithAddBtn;