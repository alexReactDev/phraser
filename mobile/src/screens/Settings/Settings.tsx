import { ScrollView } from "react-native";
import ProfilesSettings from "./components/ProfilesSettings";
import LearnModeSettings from "./components/LearnModeSettings";
import AutoCollectionsSettings from "./components/AutoCollectionsSettings";
import AISettings from "./components/AISettings";
import SuggestionsSettings from "./components/SuggestionsSettings";
import AccountManagement from "./components/AccountManagement";
import { createStackNavigator } from "@react-navigation/stack";
import ChangePassword from "./ChangePassword/ChangePassword";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_VERIFICATION_STATUS } from "@query/authorization";
import VerifyEmail from "./components/VerifyEmail";
import { observer } from "mobx-react-lite";
import session from "@store/session";
import { useEffect, useState } from "react";
import OtherSettings from "./components/OtherSettings";
import NotificationSettings from "./components/NotificationSettings";
import PremiumSettings from "./components/PremiumSettings";
import SubscriptionInfo from "./components/SubscriptionInfo";
import { GET_PREMIUM_DATA } from "@query/premium";
import AppearanceSettings from "./components/Appearance";

export type SettingsNavigatorParams = {
	Settings: undefined,
	"Change password": undefined,
	"Subscription info": undefined
}

const Navigator = createStackNavigator<SettingsNavigatorParams>();

function SettingsNavigation() {
	return (
		<Navigator.Navigator id="SettingsNavigator">
			<Navigator.Screen name="Settings" component={Settings} />
			<Navigator.Screen name="Change password" component={ChangePassword} />
			<Navigator.Screen name="Subscription info" component={SubscriptionInfo} />
		</Navigator.Navigator>
	)
}

const Settings = observer(function() {
	const [ emailVerified, setEmailVerified ] = useState<null | boolean>(null);
	const [ getVerificationStatus ] = useLazyQuery(GET_VERIFICATION_STATUS);
	const { data: premiumData } = useQuery(GET_PREMIUM_DATA, { variables: { userId: session.data.userId } });

	useEffect(() => {
		if(emailVerified) return;

		async function checkVerification() {
			const res = await getVerificationStatus({
				variables:  {
					userId: session.data.userId
				},
				fetchPolicy: "no-cache"
			});

			if(res.data?.getVerificationStatus.isVerified) {
				setEmailVerified(true);
			} else {
				setEmailVerified(false);
			};
		}

		checkVerification();

		const timer = setInterval(checkVerification, 1000 * 10); //10 sec

		return () => clearInterval(timer);
	}, [ emailVerified ]);

	return (
		<ScrollView>
			{
				emailVerified === false &&
				<VerifyEmail />
			}
			<ProfilesSettings />
			<AutoCollectionsSettings />
			<LearnModeSettings />
			<NotificationSettings />
			<PremiumSettings />
			{
				premiumData?.getPremiumData?.hasPremium && 
				<>				
					<SuggestionsSettings />
					<AISettings />
				</>
			}
			<AppearanceSettings />
			<OtherSettings />
			<AccountManagement />
		</ScrollView>
	)
});

export default SettingsNavigation;