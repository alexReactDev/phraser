import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function DescriptionTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. Description
			</Text>
			<Text style={styles.text}>
				The way of learning when you have to guess the phrase by its description works well when you already know its meaning, but want to consolidate your knowledge.
			</Text>
			<Text style={styles.text}>
				Tap on the card below to show the phrase and its translation. Use buttons below to go to next phrase. It's up to you to decide whether you remember the phrase or not. It will keep appearing until you tap "remembered" specified in settings amount of times (1 by default). You can monitor progress with the bar on top.
			</Text>
			<Text style={styles.text}>
				Sometimes, ChatGPT can generate illogical descriptions or give errors. In that case, simply tap on "Refresh" button.
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

export default DescriptionTutorial;