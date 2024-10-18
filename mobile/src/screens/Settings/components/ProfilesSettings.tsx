import { StyleSheet, Text, View } from "react-native";
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
import ModalWithBody from "@components/ModalWithBody";
import Button from "@components/Button";
import EditProfile from "./EditProfile";

const ProfilesSettings = observer(function() {
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ loading, setLoading ] = useState(false);

	const { data: { getUserProfiles: profiles = []} = {}, error } = useQuery(GET_USER_PROFILES, { variables: { id: session.data.userId }});
	const [ createProfile ] = useMutation(CREATE_PROFILE);

	async function createProfileHandler(input: string) {
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

		setDisplayModal(false);
		loadingSpinner.dismissLoading();
		setLoading(false);
	}

	if(error) return <ErrorComponent message="Failed to load profiles data" />

	return (
		<SettingsGroup title="Profiles">
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<EditProfile onInput={createProfileHandler} />
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
					style={styles.button}
				></Button>
			</View>
		</SettingsGroup>
	)
});

const styles = StyleSheet.create({
	subtitle: {
		fontSize: 17,
		color: fontColor,
		marginBottom: 8
	},
	button: {
		marginTop: 4
	}
})

export default ProfilesSettings;