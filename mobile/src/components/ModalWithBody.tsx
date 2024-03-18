import { StyleSheet, View } from "react-native";
import ModalComponent from "./ModalComponent";

interface IProps {
	visible: boolean,
	onClose: () => void,
	children: React.ReactNode
}

function ModalWithBody({ children, ...props}: IProps) {
	return (
		<ModalComponent {...props}>
			<View style={styles.body}>
				{children}
			</View>
		</ModalComponent>
	)
}

const styles = StyleSheet.create({
	body: {
		width: "85%",
		marginBottom: 30,
		marginTop: 55,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 5,
		padding: 20,
		backgroundColor: "white"
	},
})

export default ModalWithBody;