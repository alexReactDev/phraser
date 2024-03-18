import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function CollectionsTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. Collections
			</Text>
			<Text style={styles.text}>
				Collections are kind of folders where your phrases are stored. You can use any way to sort phrases by collections, like different logical groups (food, animals...), parts of speech (verbs, nouns...) or any other. You can create collections of any size, however, we recommend to keep them not very big (max 50 words) so that, it was easy to learn them. Remember that you always can create several collections for one topic/subject simply by numbering them (like collection abc 1, collection abc 2 e.t.c.).
			</Text>
			<Text style={styles.text}>
				Collections in turn are stored in profiles. Think of profiles as sort of isolated spaces, each of which contains its own collections, autocollections and phrases. It's convenient to have different profiles for different languages. However, you can use one profile all the time, it's up to you. You can manage profiles in app settings.
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

export default CollectionsTutorial;