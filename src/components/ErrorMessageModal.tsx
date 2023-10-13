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
					<Text style={styles.title}>
						{errorMessage}
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
		paddingRight: 30,
		minWidth: 100,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "red",
		backgroundColor: "pink",
	},
	title: {
		color: "red",
		fontWeight: "bold"
	},
	btn: {
		position: "absolute",
		right: 2,
		top: 2
	}
})

export default ErrorMessageModal;