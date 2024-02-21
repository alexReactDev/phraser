import { fontColor } from "@styles/variables";
import { Image, StyleSheet, Text, View } from "react-native";

function LoadingScreen() {
	return (
		<View style={styles.container}>
			<View style={styles.body}>
				<Image
					source={require("@assets/icon256x256_transparent.png")}
					alt="logo"
					style={styles.image}
					resizeMode="contain"
					width={256}
					height={256}
				></Image>
				<Text style={styles.text}>
					Loading...
				</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		alignItems: "center",
		justifyContent: "center"
	},
	body: {
		alignItems: "center",
		justifyContent: "center"
	},
	image: {
		width: 256,
		height: 256
	},
	text: {
		marginTop: 12,
		textAlign: "center",
		color: fontColor,
		fontSize: 22
	}
})

export default LoadingScreen;