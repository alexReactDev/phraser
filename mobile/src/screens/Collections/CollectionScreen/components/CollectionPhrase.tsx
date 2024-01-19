import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IPhrase } from "@ts/phrases";
import { Ionicons } from "@expo/vector-icons";
import { fontColorFaint } from "../../../../styles/variables";
import { useMutation } from "@apollo/client";
import { DELETE_PHRASE, GET_COLLECTION_PHRASES, GET_PHRASE, GET_PHRASE_WITH_COLLECTION } from "../../../../query/phrases";
import { useState } from "react";
import { useClickOutside } from "react-native-click-outside";
import ModalComponent from "@components/ModalComponent";
import MovePhrase from "./MovePhrase";
import Checkbox from "expo-checkbox";
import { observer } from "mobx-react-lite";
import errorMessage from "@store/errorMessage";
import loadingSpinner from "@store/loadingSpinner";
import ModalWithBody from "@components/ModalWithBody";

interface IProps {
	phrase: IPhrase,
	colId: string,
	navigation: any,
	editable: boolean,
	selectionEnabled: boolean,
	isSelected: boolean,
	enableSelection: () => void,
	onChange: (selected: boolean) => void
}

const CollectionPhrase = observer(function({ phrase, colId, navigation, editable, selectionEnabled, isSelected, enableSelection, onChange }: IProps) {
	const [ showControls, setShowControls ] = useState(false);
	const [ displayModal, setDisplayModal ] = useState(false);
	const ref = useClickOutside(() => setShowControls(false));

	const [ deletePhrase ] = useMutation(DELETE_PHRASE);

	async function deleteHandler() {
		loadingSpinner.setLoading();

		try {
			await deletePhrase({
				variables: { id: phrase.id },
				refetchQueries: [GET_COLLECTION_PHRASES, GET_PHRASE, GET_PHRASE_WITH_COLLECTION]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to delete phrase ${e.toString()}`);
		}

		loadingSpinner.dismissLoading();
	}

	return (
		<View style={styles.container} ref={ref}>
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<MovePhrase id={phrase.id} currentColId={colId} />
			</ModalWithBody>
			{
				selectionEnabled &&
				<View style={styles.checkBoxContainer}>
					<Checkbox
						value={isSelected}
						onValueChange={onChange}
						color={isSelected ? "#81b0ff" : undefined}
					/>
				</View>
			}
			<TouchableOpacity
				style={styles.info}
				onPress={() => {
					if(!editable) return;

					if(selectionEnabled) {
						onChange(isSelected ? false : true)
					} else {
						setShowControls(!showControls)
					}
				}}
				onLongPress={() => {
					if(!editable) return;
					
					enableSelection();
					onChange(true);
				}}
				activeOpacity={0.7}
			>
				<Text style={styles.title}>
					{phrase.value}
				</Text>
				<Text style={styles.subtitle}>
					{phrase.translation}
				</Text>
			</TouchableOpacity>
			{
				showControls &&
				<View style={styles.controls}>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => setDisplayModal(true)}
					>
						<Ionicons name="ios-return-up-forward" size={24} color="black" />
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => navigation.navigate("Add", { mutateId: phrase.id })}
					>
						<Ionicons name="pencil" size={24} color={"gray"} />
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={deleteHandler}
					>
						<Ionicons name="trash-outline" size={24} color={"gray"} />
					</TouchableOpacity>
				</View>
			}
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 8,
		backgroundColor: "#ededede"
	},
	info: {
		flex: 1,
		padding: 5
	},
	controls: {
		width: "30%",
		flexDirection: "row",
		gap: 15,
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		marginBottom: 2,
		fontSize: 18
	},
	subtitle: {
		fontSize: 14,
		color: fontColorFaint
	},
	checkBoxContainer: {
		width: "10%",
		alignItems: "center",
		justifyContent: "center"
	}
})

export default CollectionPhrase;