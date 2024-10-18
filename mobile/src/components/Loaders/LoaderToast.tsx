import loadingSpinner from "@store/loadingSpinner";
import { bgColorAccent } from "@styles/variables";
import { observer } from "mobx-react-lite";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoaderToast = observer(function() {
	if(!loadingSpinner.displaySpinner) return "";

	return (
		<View style={styles.body}>
			<ActivityIndicator size={"small"} color={"gray"} />
		</View>
	)
});

const styles = StyleSheet.create({
	body: {
		zIndex: 99,
		position: "absolute",
		right: 10,
		top: 55,
		width: 40,
		height: 40,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: bgColorAccent,
		elevation: 2
	}
})

export default LoaderToast;