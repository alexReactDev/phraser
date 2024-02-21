import { Image, Text, View, StyleSheet } from "react-native";
import { style as commonStyles } from "../style/style";

function WelcomeWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View style={styles.container}>
			<View style={styles.welcome}>
				<Image
					source={require("@assets/icon256x256_transparent.png")}
					alt="logo"
					style={styles.image}
					resizeMode="contain"
					width={256}
					height={256}
				></Image>
				<Text style={styles.title}>Welcome!</Text>
			</View>
			{children}
		</View>
	)
}

const styles = {
	...commonStyles,
	...StyleSheet.create({
		welcome: {
			justifyContent: "center",
			alignItems: "center"
		},
		image: {
			width: 200,
			height: 200,
			marginBottom: 8,
			marginTop: -70
		}
	})
}

export default WelcomeWrapper;