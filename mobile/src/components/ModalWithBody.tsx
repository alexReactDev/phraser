import { StyleSheet, TouchableOpacity, View } from "react-native";
import ModalComponent from "./ModalComponent";
import { Ionicons } from '@expo/vector-icons';

interface IProps {
	visible: boolean,
	onClose: () => void,
	children: React.ReactNode
}

function ModalWithBody({ children, onClose, ...props}: IProps) {
	return (
		<ModalComponent onClose={onClose} {...props}>
			<View style={styles.body}>
				<TouchableOpacity style={styles.modalCross} onPress={onClose}>
					<Ionicons name="close-circle-outline" color="gray" size={28} onPress={onClose} />
				</TouchableOpacity>
				{children}
			</View>
		</ModalComponent>
	)
}

const styles = StyleSheet.create({
	body: {
		width: "88%",
		marginBottom: 30,
		marginTop: 55,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 15,
		padding: 18,
		paddingHorizontal: 22,
		backgroundColor: "#ffffffee",
		elevation: 1
	},
	modalCross: {
		position: "absolute",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		top: 5,
		right: 5,
		zIndex: 10,
	}
})

export default ModalWithBody;