import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function Highlight({ value, translation }: { value: string, translation: string}) {
	const [ showTranslation, setShowTranslation ] = useState(false);

	return (
		<TouchableOpacity 
			onPress={() => setShowTranslation(!showTranslation)}
			style={{ backgroundColor: showTranslation ? "#fffbd8" : "#d8eaff", marginBottom: -3, paddingHorizontal: 2, borderRadius: 2 }}
		>
			<Text style={{ fontSize: 13 }}>
				{showTranslation ? translation : value}
			</Text>
		</TouchableOpacity>
	)
}

export default Highlight;