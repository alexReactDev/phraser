import { ScrollView } from "react-native";
import ProfilesSettings from "./components/ProfilesSettings";
import LearnModeSettings from "./components/LearnModeSettings";
import AutoCollectionsSettings from "./components/AutoCollectionsSettings";
import AISettings from "./components/AISettings";
import SuggestionsSettings from "./components/SuggestionsSettings";
import AccountManagement from "./components/AccountManagement";
import { createStackNavigator } from "@react-navigation/stack";
import ChangePassword from "./ChangePassword/ChangePassword";

export type SettingsNavigatorParams = {
	Settings: undefined,
	"Change password": undefined
}

const Navigator = createStackNavigator<SettingsNavigatorParams>();

function SettingsNavigation() {
	return (
		<Navigator.Navigator id="SettingsNavigator">
			<Navigator.Screen name="Settings" component={Settings} />
			<Navigator.Screen name="Change password" component={ChangePassword} />
		</Navigator.Navigator>
	)
}

function Settings() {
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
};

export default SettingsNavigation;