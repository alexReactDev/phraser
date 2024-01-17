import { ScrollView } from "react-native";
import ProfilesSettings from "./components/ProfilesSettings";
import LearnModeSettings from "./components/LearnModeSettings";
import { observer } from "mobx-react-lite";
import AutoCollectionsSettings from "./components/AutoCollectionsSettings";
import AISettings from "./components/AISettings";
import SuggestionsSettings from "./components/SuggestionsSettings";
import AccountManagement from "./components/AccountManagement";

const Settings = observer(function() {
	return (
		<ScrollView>
			<ProfilesSettings />
			<SuggestionsSettings />
			<AutoCollectionsSettings />
			<LearnModeSettings />
			<AISettings />
			<AccountManagement />
		</ScrollView>
	)
});

export default Settings;