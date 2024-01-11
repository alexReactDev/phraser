import { fontColor, nondescriptColor } from "@styles/variables";
import { IPhrase } from "@ts/phrases";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

function ShowHidePhrase({ phrase }: { phrase: IPhrase }) {
	const [ showTranslation, setShowTranslation ] = useState(false);

	return (
		<>
	
		<TouchableOpacity 
			style={style.phraseContainer}
			activeOpacity={0.7}
			onPress={() => setShowTranslation(!showTranslation)}
		>
			<Text style={style.phraseEmoji}>
				{
					showTranslation
					?
					"🐵"
					:
					"🙈"
				}
			</Text>
			<View style={style.contentContainer}>
				<Text style={showTranslation ? {...style.phraseText, backgroundColor: "#fffbd8"} : style.phraseText}>
					{
						showTranslation
						?
						phrase.translation
						:
						phrase.value
					}
				</Text>
			</View>
		</TouchableOpacity>
		</>
	)
}

const style = StyleSheet.create({
	phraseContainer: {
		flexDirection: "row",
		alignItems: "center"
	},
	phraseEmoji: {
		width: "10%",
		fontSize: 16
	},
	contentContainer: {
		maxWidth: "85%",
		overflow: "hidden"
	},
	phraseText: {
		paddingHorizontal: 4,
		paddingVertical: 1,
		borderRadius: 3,
		fontSize: 16,
		color: fontColor,
		lineHeight: 20,
		borderStyle: "dashed",
		borderColor: nondescriptColor,
		margin: -2,
		marginBottom: 0,
		borderWidth: 1
	}
})

export default ShowHidePhrase;