import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { IProfile } from "../../../types/profiles";
import { borderColor } from "../../../styles/variables";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import settings from "../../../store/settings";
import { useMutation } from "@apollo/client";
import { DELETE_PROFILE, GET_USER_PROFILES, MUTATE_PROFILE } from "../../../query/profiles";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "../../../query/settings";
import { observer } from "mobx-react-lite";
import session from "../../../store/session";
import errorMessage from "@store/errorMessage";
import loadingSpinner from "@store/loadingSpinner";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import ModalWithBody from "@components/ModalWithBody";

const Profile = observer(function({ profile }: { profile: IProfile}) {
	const [ showButtons, setShowButtons ] = useState(false);
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ input, setInput ] = useState("");
	const [ mutateProfile ] = useMutation(MUTATE_PROFILE);
	const [ deleteProfile ] = useMutation(DELETE_PROFILE);
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	if(!profile) return "";

	async function deleteHandler() {
		Alert.alert(`Delete profile "${profile.name}" ?`, "The profile will be deleted with all it's collections", [
			{
				text: "Cancel",
				style: "cancel"
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					loadingSpinner.setLoading();

					try {
						await deleteProfile({
							variables: {
								id: profile.id
							},
							refetchQueries: [GET_USER_PROFILES]
						})
					} catch (e: any) {
						console.log(e);
						errorMessage.setErrorMessage(e.toString());
					}
			
					loadingSpinner.dismissLoading();
				}
			}
		])
	}

	async function mutateHandler() {
		loadingSpinner.setLoading();

		try {
			await mutateProfile({
				variables: {
					id: profile.id,
					input: { name: input }
				},
				refetchQueries: [GET_USER_PROFILES]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		setDisplayModal(false);
		loadingSpinner.dismissLoading();
	}

	async function selectHandler() {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: {
						activeProfile: profile.id
					}
				},
				refetchQueries: [GET_USER_SETTING]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	return (
		<>
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<View style={styles.modalBody}>
					<Text style={styles.modalTitle}>
						Profile name
					</Text>
					<StyledTextInput
						autoFocus
						value={input}
						onChangeText={(t: string) => setInput(t)}
						style={styles.modalInput}
						placeholder="Nice name..."
					/>
					<Button
						title="Confirm"
						onPress={mutateHandler}
					></Button>
				</View>
			</ModalWithBody>
			<TouchableOpacity 
				style={styles.container} 
				activeOpacity={0.7}
				onPress={() => setShowButtons(!showButtons)}
			>
				<Text>
					{profile.name}
				</Text>
				{
					showButtons &&
					<View style={styles.iconsContainer}>
						<TouchableOpacity
							disabled={profile.id === settings.settings.activeProfile}
							onPress={() => selectHandler()}
						>
							<Ionicons name={profile.id === settings.settings.activeProfile ? "checkmark-circle" : "checkmark"} size={20} color="gray" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setDisplayModal(true)}
						>
							<Ionicons name="pencil" size={17} color="gray" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => deleteHandler()}
						>
							<Ionicons name="trash-outline" size={17} color="gray" />
						</TouchableOpacity>
					</View>
				}
			</TouchableOpacity>	
		</>
	)
});

const styles = StyleSheet.create({
	container: {
		height: 40,
		flexDirection: "row",
		justifyContent: 'space-between',
		alignItems: "center",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: borderColor,
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		backgroundColor: "#f5f5f5"
	},
	iconsContainer: {
		flexDirection: "row",
		gap: 8,
		height: 20,
	},
	modalContainer: {
		position: "relative",
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff88"
	},
	modalBody: {},
	modalCross: {
		position: "absolute",
		top: 0,
		right: 10
	},
	modalTitle: {
		fontSize: 18,
		marginBottom: 15
	},
	modalInput: {
		marginBottom: 15
	}
})

export default Profile;