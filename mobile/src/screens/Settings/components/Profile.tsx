import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import errorMessage from "@store/toastMessage";
import loadingSpinner from "@store/loadingSpinner";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import ModalWithBody from "@components/ModalWithBody";
import EditProfile from "./EditProfile";

const Profile = observer(function({ profile }: { profile: IProfile}) {
	const [ showButtons, setShowButtons ] = useState(false);
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ loading, setLoading ] = useState(false);

	const [ mutateProfile ] = useMutation(MUTATE_PROFILE);
	const [ deleteProfile ] = useMutation(DELETE_PROFILE);
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	if(!profile) return "";

	async function deleteHandler() {
		Alert.alert(`Delete profile "${profile.name}" ?`, "The profile will be deleted with all its collections and stats", [
			{
				text: "Cancel",
				style: "cancel"
			},
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					if(loading) return;

					loadingSpinner.setLoading();
					setLoading(true);

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
					setLoading(false);
				}
			}
		])
	}

	async function mutateHandler(input: string) {
		if(loading) return;

		loadingSpinner.setLoading();
		setLoading(true);

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
		setLoading(false);
	}

	async function selectHandler() {
		if(loading) return;

		loadingSpinner.setLoading();
		setLoading(true);

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
		setLoading(false);
	}

	return (
		<>
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<EditProfile onInput={mutateHandler} />
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
							onPress={() => !loading && setDisplayModal(true)}
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
	}
})

export default Profile;