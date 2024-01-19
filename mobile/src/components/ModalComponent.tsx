import { Modal, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface IProps {
	visible: boolean,
	onClose: () => void,
	children: React.ReactNode
}

function ModalComponent({ visible, onClose, children }: IProps) {
	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			statusBarTranslucent
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<TouchableOpacity style={styles.modalCross} onPress={onClose}>
					<Ionicons name="close" color="gray" size={32} />
				</TouchableOpacity>
				{children}
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		position: "relative",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff88"
	},
	modalCross: {
		position: "absolute",
		top: 15,
		right: 15
	}
})

export default ModalComponent;