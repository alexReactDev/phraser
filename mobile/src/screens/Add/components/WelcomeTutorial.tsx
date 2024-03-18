import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function WelcomeTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Welcome to Phraser!
			</Text>
			<Text style={styles.text}>
				With Phraser you can keep, manage phrases in a convenient way, and build your vocabulary using AI-powered methods. Notice, that Phraser is language-agnostic and not opinionated app. Therefore, it isn't tied to any specific language, and doesn't provide prepared translations. You can use any value, that you think works better as a translation. In turn, Phraser is the tool that provides you more convenient way to keep and manage phrases than just writing them down to notebook.
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

export default WelcomeTutorial;