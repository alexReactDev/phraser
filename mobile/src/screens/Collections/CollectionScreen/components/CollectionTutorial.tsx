import { skipTutorial } from "@utils/tutorial";
import { Button, StyleSheet, Text, View } from "react-native";

function CollectionTutorial({ onClose }: { onClose: () => void}) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Tutorial. Managing collection
			</Text>
			<Text style={styles.text}>
				If you need to rename or delete collection, tap on  <Text>⁝</Text>  in the left upper corner.
			</Text>
			<Text style={styles.text}>
				If you want to edit, delete or move phrase to another collection, tap on it and choose necessary action.
			</Text>
			<Text style={styles.text}>
				If you want to delete or move several phrases, long press on any phrase to activate selection.
			</Text>
			<Text style={styles.text}>
				If you want to learn phrases from this collection, tap on the button below and choose the method you like.
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

export default CollectionTutorial;