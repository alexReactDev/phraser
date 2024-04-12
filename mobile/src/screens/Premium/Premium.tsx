import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontColor, fontColorLight, nondescriptColor } from "@styles/variables";
import { StackScreenProps } from "@react-navigation/stack";
import { PremiumNavigatorParams } from "src/Navigation";

type NavigationProps = StackScreenProps<PremiumNavigatorParams, "Premium", "PremiumNavigator">

function Premium({ navigation }: NavigationProps) {
	return (
		<View style={styles.container}>
			<View style={styles.body}>
				<View style={styles.iconContainer}>
					<Ionicons name="star" size={128} color="#f1b51b" />
				</View>
				<Text style={styles.title}>
					Get premium
				</Text>
				<View style={styles.featuresList}>
					<View style={styles.feature}>
						<Text style={styles.featureIcon}>
							●
						</Text>
						<Text style={styles.featureText}>
							No ads
						</Text>
					</View>
					<View style={styles.feature}>
						<Text style={styles.featureIcon}>
							●
						</Text>
						<Text style={styles.featureText}>
							Unlock all learning methods
						</Text>
					</View>
					<View style={styles.feature}>
						<Text style={styles.featureIcon}>
							●
						</Text>
						<Text style={styles.featureText}>
							Get translation suggestions
						</Text>
					</View>
				</View>
				<TouchableOpacity 
					style={styles.btn}
					activeOpacity={0.8}
					onPress={() => navigation.navigate("Plans")}
				>
					<Text style={styles.btnText}>
						SUBSCRIBE
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		padding: 10
	},
	body: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		borderColor: nondescriptColor,
		borderStyle: "solid",
		borderWidth: 1,
		borderRadius: 12,
		padding: 30
	},
	iconContainer: {
		marginBottom: 10
	},
	title: {
		marginBottom: 20,
		fontSize: 28,
		color: "#555",
		fontWeight: "bold",
		textTransform: "uppercase"
	},
	featuresList: {
		gap: 12
	},
	feature: {
		flexDirection: "row"
	},
	featureIcon: {
		width: "10%",
		fontSize: 16,
		color: "grey"
	},
	featureText: {
		color: fontColor,
		fontSize: 16
	},
	btn: {
		width: 200,
		height: 40,
		marginTop: 30,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 7,
		backgroundColor: "#799dea"
	},
	btnText: {
		color: fontColorLight,
		fontWeight: "bold"
	}
})

export default Premium;