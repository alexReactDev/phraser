import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function AITextTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. AI generated text
			</Text>
			<Text style={styles.text}>
				AI generated text or sentences let you learn your phrases in context and possibly even learn new ones (by the way, you can switch to "Add" tab if you need to save new phrase and then return to learning, progress will be kept). 
			</Text>
			<Text style={styles.text}>
				Use buttons below to mark phrase as remembered or forgotten. It's up to you to decide whether you remember the phrase or not. When all phrases are marked, tap next. You can monitor progress with the bar on top
			</Text>
			<Text style={styles.text}>
				You can tap on the phrase, to see its translation.
			</Text>
			<Text style={styles.text}>
				Sometimes, ChatGPT can give illogical results or errors. In that case, simply tap on "Refresh" button.
			</Text>
			<Text style={styles.text}>
				Use Text/Sentences button to switch between text and sentences modes.
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
};

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

export default AITextTutorial;