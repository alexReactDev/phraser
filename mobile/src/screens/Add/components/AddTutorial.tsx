import { useQuery } from "@apollo/client";
import { GET_PREMIUM_DATA } from "@query/premium";
import session from "@store/session";
import { observer } from "mobx-react-lite";
import { Button, StyleSheet, Text, View } from "react-native";

const AddTutorial = observer(function ({ onClose, skipTutorial }: { onClose: () => void, skipTutorial: () => void }) {
	const { data: { getPremiumData } = {} } = useQuery(GET_PREMIUM_DATA, { variables: { userId: session.data.userId } });

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. Saving new phrase
			</Text>
			<Text style={styles.text}>
				Enter any phrase you want to learn in the first field. Notice, that this value will be used by ChatGPT for generating context, so we recommend keeping it clean and enter only those words you want to learn. You can make any additional notes and provide additional context (that is encouraged) in the translation field.
			</Text>
			<Text style={styles.text}>
				Enter translation of the phrase in the second field. You can use any value as translation. We encourage you to make any additional notes you may need like usage examples, usage with prepositions, tenses e.t.c. It will help you build your vocabulary faster and won't affect app behavior (as long as you keep those notes in the translation field).
			</Text>
			{
				getPremiumData?.hasPremium &&
				<Text style={styles.text}>
					You can use suggestions that appear in the bottom of translation field. Tap on suggestion text to apply it, or ignore it if you want to use your own translation. You can edit suggestions language in the app settings.
				</Text>
			}
			<Text style={styles.text}>
				Select a collection or create new one. All your phrases are stored in collections, think of them as kind of folders. Phraser is not opinionated about the way you name and manage your collections, it's all up to you. However, if you need some tips, you can visit our website.
			</Text>
			<Text style={styles.text}>
				When everything is set, tap save button in right bottom corner. You can see all your collections in the corresponding tab.
			</Text>
			<View style={styles.btnContainer}>
				<Button 
					onPress={() => {
						onClose();
						skipTutorial();
					}} 
					title="Skip tutorial"
					color={"#f3a571"}
				/>
				<View style={styles.btn}>
					<Button onPress={onClose} title="OK" color={"#799dea"} />
				</View>
			</View>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		gap: 10
	},
	title: {
		fontSize: 18,
		textAlign: "center"
	},
	text: {
		fontSize: 15,
		lineHeight: 20,
		textAlign: "center"
	},
	btnContainer: {
		marginTop: 10,
		flexDirection: "row",
		justifyContent: "space-between"
	},
	btn: {
		minWidth: 60
	}
});

export default AddTutorial;