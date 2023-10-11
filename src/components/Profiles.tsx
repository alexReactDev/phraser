import { useMutation, useQuery } from "@apollo/client";
import { Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import { GET_USER_PROFILES } from "../query/profiles";
import { UPDATE_USER_SETTINGS } from "../query/settings";
import { IProfile } from "../types/profiles";
import session from "../store/session";

function Profiles() {
	const { data, loading, error } = useQuery(GET_USER_PROFILES, {
		variables: {
			id: session.data.userId
		}
	});
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	function profileSelectHandler(selected: IProfile) {
		updateUserSettings({
			variables: {
				id: session.data.userId,
				input: { activeProfile: selected.id }
			}
		})
	}

	if(error) return (
		<View>
			<Text>Failed to load profiles</Text>
		</View>
	)

	if (loading || !data) return "";

	return (
		<View>
			<SelectDropdown
				data={data.getUserProfiles}
				onSelect={(selected) => profileSelectHandler(selected)}
				rowTextForSelection={(profile) => profile.name}
				buttonTextAfterSelection={(profile) => profile.name}
				defaultButtonText="Select profile"
				renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color="gray" />}
			></SelectDropdown>
		</View>
	)
}

export default Profiles;