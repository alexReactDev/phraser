import { ScrollView } from "react-native";
import UserInfo from "./UserInfo";
import ProfilesSettings from "./ProfilesSettings";
import LearnModeSettings from "./LearnModeSettings";

function Settings() {
	return (
		<ScrollView>
			<UserInfo />
			<ProfilesSettings />
			<LearnModeSettings />
		</ScrollView>
	)
}

export default Settings;