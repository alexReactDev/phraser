import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function CardsTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. Cards
			</Text>
			<Text style={styles.text}>
				Classic flip cards are the simplest way to build vocabulary. Just tap on the card to see translation.
			</Text>
			<Text style={styles.text}>
				Use buttons below to go to next phrase. It's up to you to decide whether you remember the phrase or not. It will keep appearing until you tap "remembered" specified in settings amount of times (1 by default).
			</Text>
			<Text style={styles.text}>
				You can monitor progress with the bar on top.
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

export default CardsTutorial;