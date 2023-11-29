import { Button, Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import ErrorComponent from "../../../components/Errors/ErrorComponent";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PROFILE, GET_USER_PROFILES } from "../../../query/profiles";
import session from "../../../store/session";
import Profile from "./Profile";
import { IProfile } from "../../../types/profiles";
import settings from "../../../store/settings";
import { borderColor, fontColor } from "../../../styles/variables";
import { observer } from "mobx-react-lite";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import ErrorMessageModal from "../../../components/Errors/ErrorMessageModal";

const ProfilesSettings = observer(function() {
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ input, setInput ] = useState("");
	const { data: { getUserProfiles: profiles = []} = {}, error } = useQuery(GET_USER_PROFILES, { variables: { id: session.data.userId }});
	const [ createProfile ] = useMutation(CREATE_PROFILE);
	const [ errorMessage, setErrorMessage ] = useState("");

	async function createProfileHandler() {
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
			setErrorMessage(e.toString());
		}

		setInput("");
		setDisplayModal(false);
	}

	if(error) return <ErrorComponent message="Failed to load profiles data" />

	return (
		<View style={styles.container}>
			{
				errorMessage && <ErrorMessageModal errorMessage={errorMessage} onClose={() => setErrorMessage("")} />
			}
			<Modal
				visible={displayModal}
				transparent={true}
				animationType="slide"
			>
				<View style={styles.modalContainer}>
					<TouchableOpacity style={styles.modalCross} onPress={() => setDisplayModal(false)}>
						<Ionicons name="close" color="gray" size={24} />
					</TouchableOpacity>
					<View style={styles.modalBody}>
						<Text style={styles.modalTitle}>
							Profile name
						</Text>
						<TextInput
							autoFocus
							value={input}
							onChangeText={(t) => setInput(t)}
							style={styles.modalInput}
						></TextInput>
						<Button
							title="Confirm"
							onPress={createProfileHandler}
						></Button>
					</View>
				</View>
			</Modal>
			<Text style={styles.title}>
				Profiles
			</Text>
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
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		margin: 10,
		padding: 10,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: borderColor,
		borderRadius: 5,
		backgroundColor: "#fefefe"
	},
	title: {
		fontSize: 21,
		color: fontColor,
		marginBottom: 10
	},
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
	modalBody: {
		width: 300,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		padding: 20,
		position: "relative",
		backgroundColor: "white"
	},
	modalCross: {
		position: "absolute",
		top: 0,
		right: 0
	},
	modalTitle: {
		fontSize: 18,
		marginBottom: 15
	},
	modalInput: {
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 2,
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginBottom: 15
	}
})

export default ProfilesSettings;