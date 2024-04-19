import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function AssociativePicturesTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. Associative pictures
			</Text>
			<Text style={styles.text}>
				Associative pictures — are the pictures generated by AI as a visual representation of your phrase. Remember, that AI can generate wrong pictures, especially when it comes to abstract things (e.g. love, friendship ...). You can use refresh button to generate new image.
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

export default AssociativePicturesTutorial;