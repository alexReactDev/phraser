import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface IProps {
	errorMessage?: string,
	onClose: () => void
}

function ErrorMessageModal({ errorMessage = "Something went wrong", onClose }: IProps) {
	return (
		<Modal
			visible={true}
			animationType="fade"
			transparent
		>
			<View style={styles.container}>
				<View style={styles.body}>
						<TouchableOpacity
							onPress={onClose}
							style={styles.btn}
						>
							<Ionicons name="close" color="gray" size={24} />
						</TouchableOpacity>
					<Ionicons name="alert-circle-outline" size={22} color="gray" />
					<Text style={styles.title}>
						{errorMessage.toString()}
					</Text>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		position: "relative"
	},
	body: {
		position: "absolute",
		right: 15,
		top: 15,
		padding: 10,
		paddingRight: 35,
		minWidth: 200,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		flexDirection: "row",
		alignItems: "center",
		gap: 2.5,
		backgroundColor: "#f5f5f5",
		shadowColor: "black",
		shadowOffset: { width: 10, height: 10 },
		shadowOpacity: 1,
		shadowRadius: 5,
		shadowSize: 10

	},
	title: {
		color: "darkgrey",
		fontWeight: "bold"
	},
	btn: {
		position: "absolute",
		right: 2,
		top: 9.5
	}
})

export default ErrorMessageModal;