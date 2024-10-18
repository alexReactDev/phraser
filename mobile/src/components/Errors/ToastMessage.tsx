import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { observer } from "mobx-react-lite";
import errorMessage from "@store/toastMessage";
import { useEffect } from "react";

const ErrorMessageToast = observer(function () {
	useEffect(() => {
		if(errorMessage.displayMessage) {
			const timeout = setTimeout(() => errorMessage.dismissErrorMessage(), 3000);
			
			return () => clearTimeout(timeout);
		}
	}, [errorMessage.displayMessage])
	
	if(!errorMessage.displayMessage) return "";

	return (
		<View style={styles.body}>
			<TouchableOpacity
				onPress={() => errorMessage.dismissErrorMessage()}
				style={styles.btn}
			>
				<Ionicons name="close" color="#999" size={20} />
			</TouchableOpacity>
			<Ionicons style={styles.icon} name={errorMessage.type === "error" ? "alert-circle-outline": "information-circle-outline"} size={23} color="#999" />
			<Text style={styles.message}>
				{errorMessage.message}
			</Text>
		</View>
	)
})

const styles = StyleSheet.create({
	body: {
		zIndex: 99,
		position: "absolute",
		right: 10,
		top: 55,
		paddingVertical: 10,
		paddingLeft: 8,
		paddingRight: 20,
		width: 220,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "#bbb",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
		backgroundColor: "#fafafa",
		elevation: 2
	},
	icon: {
		alignSelf: "flex-start",
		flexShrink: 0
	},
	message: {
		flex: 1,
		color: "darkgrey",
		fontWeight: "bold",
		textAlign: "center"
	},
	btn: {
		position: "absolute",
		right: 1,
		top: 1
	}
})

export default ErrorMessageToast;