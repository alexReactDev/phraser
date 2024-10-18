import { forwardRef, LegacyRef } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

const StyledSelect = forwardRef(function StyledSelect({ disabled, ...props }: SelectDropdown['props'], ref) {
	const receivedStyles = props.buttonStyle as ViewStyle || {};

	return (
		<SelectDropdown 
			{...props}
			ref={ref as LegacyRef<SelectDropdown>}
			buttonStyle={{
				...styles.select,
				...receivedStyles
			}}
		></SelectDropdown>
	)
})

const styles = StyleSheet.create({
	select: {
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e5e5e5",
		backgroundColor: "#f3f3f3aa"
	}
})

export default StyledSelect;