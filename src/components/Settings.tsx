import { View, Text } from "react-native";
import UserInfo from "./UserInfo";
import ProfilesSettings from "./ProfilesSettings";

function Settings() {
	return (
		<View>
			<UserInfo />
			<ProfilesSettings />
		</View>
	)
}

export default Settings;