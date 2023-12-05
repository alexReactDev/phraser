import { useMutation, useQuery } from "@apollo/client";
import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import { GET_USER_PROFILES } from "../query/profiles";
import { UPDATE_USER_SETTINGS } from "../query/settings";
import { IProfile } from "../types/profiles";
import session from "../store/session";
import settings from "../store/settings";
import { borderColor, fontColor, nondescriptColor } from "../styles/variables";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import errorMessage from "@store/errorMessage";
import loadingSpinner from "@store/loadingSpinner";

const Profiles = observer(function () {
	const { data, loading, error } = useQuery(GET_USER_PROFILES, {
		variables: {
			id: session.data.userId
		}
	});
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);
	
	const selectDropdownRef = useRef(null);

	useEffect(() => {		
		if(!selectDropdownRef.current) return;

		//@ts-ignore TS doesn't recognize SelectDropdown ref methods
		selectDropdownRef.current.selectIndex(data.getUserProfiles.findIndex((profile: IProfile) => profile.id === settings.settings.activeProfile));
	}, [settings.settings.activeProfile, loading])

	async function profileSelectHandler(selected: IProfile) {
		if(selected.id === settings.settings.activeProfile) return;

		try {
			const res = await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { activeProfile: selected.id }
				}
			});
			settings.settingsLoaded(res.data.updateUserSettings);
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(`Failed to switch profile ${e.toString()}`);
		}
	}

	if(error) return (
		<View>
			<Text>Failed to load profiles</Text>
		</View>
	)

	if (loading || !data) return "";

	return (
		<View style={styles.container}>
			<SelectDropdown
				ref={selectDropdownRef}
				data={data.getUserProfiles}
				onSelect={(selected) => profileSelectHandler(selected)}
				rowTextForSelection={(profile) => profile.name}
				buttonTextAfterSelection={(profile) => profile.name}
				defaultButtonText="Select profile"
				renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
				buttonStyle={styles.button}
				buttonTextStyle={styles.buttonText}
			></SelectDropdown>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		marginRight: 10
	},
	button: {
		width: 150,
		height: 40,
		borderWidth: 1,
		borderColor: borderColor,
		borderStyle: "solid"
	},
	buttonText: {
		fontSize: 15,
		color: fontColor
	}
})

export default Profiles;