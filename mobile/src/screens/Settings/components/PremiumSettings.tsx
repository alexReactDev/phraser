import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SettingsGroup from "./SettingsGroup";
import { useQuery } from "@apollo/client";
import { GET_PREMIUM_DATA } from "@query/premium";
import session from "@store/session";
import { observer } from "mobx-react-lite";
import ErrorComponent from "@components/Errors/ErrorComponent";
import { fontColor, fontColorFaint } from "@styles/variables";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { TSubscriptionPlans }  from "@ts/premium"
import { Ionicons } from '@expo/vector-icons';
import moment from "moment";
import { useState } from "react";
import ModalWithBody from "@components/ModalWithBody";
import CancelSubscription from "./CancelSubscription";
import { StackNavigationProp } from "@react-navigation/stack";
import { SettingsNavigatorParams } from "../Settings";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NavigatorParams, PremiumNavigatorParams } from "src/Navigation";

export const subscriptionPlansNames = {
	"standard-yearly": "Annual subscription",
	"standard-monthly": "Monthly subscription"
}

type NavigationProp = CompositeNavigationProp<
	StackNavigationProp<SettingsNavigatorParams, "Settings">,
	CompositeNavigationProp<
		BottomTabNavigationProp<NavigatorParams>,
		StackNavigationProp<PremiumNavigatorParams>
	>
>;

const PremiumSettings = observer(function() {
	const { data, error, loading } = useQuery(GET_PREMIUM_DATA, { variables: { userId: session.data.userId } });
	const navigation = useNavigation<NavigationProp>();

	const [ displayModal, setDisplayModal ] = useState(false);

	if(error) return <ErrorComponent message="Failed to load premium data" />
	if(loading) return "";

	const premiumData = data.getPremiumData;
	const expiryDate = moment(+premiumData.expires).format("DD.MM.YYYY");

	if(premiumData.hasPremium) {
		return (
			<SettingsGroup title="Premium">
				<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
					<CancelSubscription onSuccess={() => setDisplayModal(false)} />
				</ModalWithBody>
				<View style={styles.container}>
					<TouchableOpacity 
						style={styles.option}
						activeOpacity={0.5}
						onPress={() => navigation.navigate("Subscription info")}
					>
						<View style={styles.optionData}>
							<Text style={styles.optionText}>
								{subscriptionPlansNames[premiumData.plan as TSubscriptionPlans]}
								{premiumData.isTrial && " (Trial)"}
							</Text>
							<Text style={styles.optionSubText}>
								Till {expiryDate}
							</Text>
						</View>
						<View style={styles.optionIcon}>
							<Ionicons name="chevron-forward" size={24} color="grey" />
						</View>
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.option}
						activeOpacity={0.5}
						onPress={() => setDisplayModal(true)}
					>
						<Text style={{...styles.optionText, color: "#9c2323"}}>
							Cancel subscription
						</Text>
					</TouchableOpacity>
				</View>
			</SettingsGroup>
		)
	} else {
		return (
			<SettingsGroup title="Premium">
				<TouchableOpacity
					style={{...styles.option, justifyContent: "flex-start", gap: 10 }}
					activeOpacity={0.5}
					onPress={() => navigation.navigate("Premium")}
				>
					<Text style={styles.optionText}>
						GET PREMIUM 
					</Text>
					<Ionicons name="star" size={17} color="#f1b51b" style={{ marginTop: -1.5 }} />
				</TouchableOpacity>
			</SettingsGroup>
		)
	}
})

const styles = StyleSheet.create({
	container: {
		gap: -1
	},
	option: {
		borderWidth: 1,
		borderColor: "#eee",
		borderStyle: "solid",
		borderRadius: 2,
		padding: 9,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	optionData: {
		gap: 3
	},
	optionText: {
		fontSize: 15,
		color: fontColor
	},
	optionSubText: {
		color: fontColorFaint,
		fontSize: 12
	},
	optionIcon: {
		justifyContent: "center"
	}
})

export default PremiumSettings;