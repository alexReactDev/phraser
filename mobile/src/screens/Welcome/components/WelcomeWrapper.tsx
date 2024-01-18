import { Text, View } from "react-native";
import { style } from "../style/style";

function WelcomeWrapper({ children }: { children: React.ReactNode }) {
	return (
		<View style={style.container}>
			<Text style={style.title}>Welcome!</Text>
			{children}
		</View>
	)
}

export default WelcomeWrapper;