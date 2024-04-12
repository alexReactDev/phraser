import { fontColor, fontColorLight, nondescriptColor } from "@styles/variables";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Plans() {
	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.title}>
					Pay monthly
				</Text>
				<View style={styles.priceContainer}>
					<Text style={styles.price}>
						8
					</Text>
					<Text style={styles.priceCurrency}>
						$
					</Text>
					<Text style={styles.pricePeriod}>
						/mo
					</Text>
				</View>
				<Text style={styles.description}>
					Pay 8$ every month
				</Text>
				<TouchableOpacity 
					style={styles.btn}
					activeOpacity={0.8}
					onPress={() => {}}
				>
					<Text style={styles.btnText}>
						SUBSCRIBE FOR 8$
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.card}>
				<Text style={styles.title}>
					Pay annually
				</Text>
				<View style={styles.priceContainer}>
					<Text style={styles.price}>
						5
					</Text>
					<Text style={styles.priceCurrency}>
						$
					</Text>
					<Text style={styles.pricePeriod}>
						/mo
					</Text>
				</View>
				<Text style={styles.description}>
					Pay 60$ every year (5$/mo)
				</Text>
				<TouchableOpacity 
					style={styles.btn}
					activeOpacity={0.8}
					onPress={() => {}}
				>
					<Text style={styles.btnText}>
						SUBSCRIBE FOR 60$
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
		gap: 20,
		padding: 10
	},
	card: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		borderColor: nondescriptColor,
		borderStyle: "solid",
		borderWidth: 1,
		borderRadius: 12,
		padding: 24
	},
	title: {
		marginBottom: 12,
		fontSize: 24
	},
	priceContainer: {
		marginBottom: 15,
		flexDirection: "row",
		alignItems: "flex-end"
	},
	price: {
		fontSize: 48,
		color: fontColor
	},
	priceCurrency: {
		paddingBottom: 8,
		fontSize: 24,
		color: fontColor
	},
	pricePeriod: {
		marginLeft: 5,
		paddingBottom: 8,
		fontSize: 24,
		color: fontColor
	},
	description: {
		fontSize: 15
	},
	btn: {
		width: 200,
		height: 40,
		marginTop: 26,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 7,
		backgroundColor: "#799dea"
	},
	btnText: {
		color: fontColorLight,
		fontWeight: "bold"
	}
});

export default Plans;