import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import ErrorComponent from "../../../components/Errors/ErrorComponent";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PROFILE, GET_USER_PROFILES } from "../../../query/profiles";
import session from "../../../store/session";
import Profile from "./Profile";
import { IProfile } from "../../../types/profiles";
import settings from "../../../store/settings";
import { fontColor } from "../../../styles/variables";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import errorMessage from "@store/toastMessage";
import loadingSpinner from "@store/loadingSpinner";
import SettingsGroup from "./SettingsGroup";
import StyledTextInput from "@components/Inputs/StyledTextInput";
import ModalWithBody from "@components/ModalWithBody";

const ProfilesSettings = observer(function() {
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ input, setInput ] = useState("");
	const [ loading, setLoading ] = useState(false);

	const { data: { getUserProfiles: profiles = []} = {}, error } = useQuery(GET_USER_PROFILES, { variables: { id: session.data.userId }});
	const [ createProfile ] = useMutation(CREATE_PROFILE);

	async function createProfileHandler() {
		if(loading) return;

		loadingSpinner.setLoading();
		setLoading(true);

		try {
			await createProfile({
				variables: {
					input: {
						userId: session.data.userId,
						name: input
					}
				},
				refetchQueries: [GET_USER_PROFILES]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		setInput("");
		setDisplayModal(false);
		loadingSpinner.dismissLoading();
		setLoading(false);
	}

	if(error) return <ErrorComponent message="Failed to load profiles data" />

	return (
		<SettingsGroup title="Profiles">
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
						onPress={createProfileHandler}
					></Button>
				</View>
			</ModalWithBody>
			<View>
				<Text style={styles.subtitle}>
					Active profile
				</Text>
				<Profile profile={profiles.find((p: IProfile) => p.id === settings.settings.activeProfile)} />
			</View>
			<View>
				<Text style={styles.subtitle}>
					My profiles
				</Text>
				{
					profiles.filter((p: IProfile) => p.id !== settings.settings.activeProfile).map((p: IProfile) => <Profile profile={p} key={p.id} />)
				}
				<Button
					title="Create profile"
					onPress={() => setDisplayModal(true)}
				></Button>
			</View>
		</SettingsGroup>
	)
});

const styles = StyleSheet.create({
	subtitle: {
		fontSize: 17,
		color: fontColor,
		marginBottom: 5
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

export default ProfilesSettings;