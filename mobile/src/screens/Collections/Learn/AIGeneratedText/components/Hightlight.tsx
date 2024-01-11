import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function Highlight({ value  }: { value: string }) {
	return (
		<TouchableOpacity //Must be exactly TouchableOpacity from gesture handler, either View or Touchable opacity from react native break the styles
			style={{ backgroundColor: "#d8eaff", marginBottom: -3, paddingHorizontal: 2, borderRadius: 2 }}
			activeOpacity={1}
		>
			<Text style={{ fontSize: 13 }}>
				{value}
			</Text>
		</TouchableOpacity>
	)
}

export default Highlight;