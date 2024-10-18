import { Modal, ScrollView, StyleSheet } from "react-native";

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
			<ScrollView style={styles.modalContainer} contentContainerStyle={{justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
				{children}
			</ScrollView>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		position: "relative",
		width: "100%",
		height: "100%",
		backgroundColor: "#ffffff88"
	}
})

export default ModalComponent;