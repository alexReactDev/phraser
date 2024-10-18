import { useQuery } from "@apollo/client";
import ErrorComponent from "@components/Errors/ErrorComponent";
import Loader from "@components/Loaders/Loader";
import { GET_PREMIUM_DATA } from "@query/premium";
import session from "@store/session";
import { TSubscriptionPlans } from "@ts/premium";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { StyleSheet, Text, View } from "react-native";
import { subscriptionPlansNames } from "./PremiumSettings";
import { borderColor, fontColorFaint } from "@styles/variables";

const SubscriptionInfo = observer(function () {
	const { data, error, loading } = useQuery(GET_PREMIUM_DATA, { variables: { userId: session.data.userId } });

	if(loading) return <Loader />
	if(error) return <ErrorComponent message="Failed to load subscription data" />

	const premiumData = data.getPremiumData;
	const expiryDate = moment(+premiumData.expires).format("DD.MM.YYYY");
	const creationDate = moment(+premiumData.created).format("DD.MM.YYYY");
	let trialStartDate;
	let trialEndDate;

	if(premiumData.isTrial) {
		trialStartDate = moment(+premiumData.trialData.started).format("DD.MM.YYYY");
		trialEndDate = moment(+premiumData.trialData.ends).format("DD.MM.YYYY");
	}

	return (
		<View style={styles.container}>
			<View style={styles.body}>
				<View style={styles.row}>
					<Text style={styles.rowTitle}>
						Started:
					</Text>
					<Text style={styles.rowValue}>
						{creationDate}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowTitle}>
						Expires:
					</Text>
					<Text style={styles.rowValue}>
						{expiryDate}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowTitle}>
						Plan:
					</Text>
					<Text style={styles.rowValue}>
						{subscriptionPlansNames[premiumData.plan as TSubscriptionPlans]}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowTitle}>
						Amount paid:
					</Text>
					<Text style={styles.rowValue}>
						{premiumData.transaction.paid}$
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowTitle}>
						Status:
					</Text>
					<Text style={{...styles.rowValue, textTransform: "capitalize" }}>
						{premiumData.status}
					</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.rowTitle}>
						Trial:
					</Text>
					<Text style={styles.rowValue}>
						{ premiumData.isTrial ? "Yes" : "No" }
					</Text>
				</View>
				{
					premiumData.isTrial &&
					<View style={styles.row}>
						<Text style={styles.rowTitle}>
							Trial started:
						</Text>
						<Text style={styles.rowValue}>
							{ trialStartDate }
						</Text>
					</View>
				}
				{
					premiumData.isTrial &&
					<View style={styles.row}>
						<Text style={styles.rowTitle}>
							End of trial:
						</Text>
						<Text style={styles.rowValue}>
							{ trialEndDate }
						</Text>
					</View>
				}
			</View>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		margin: 10
	},
	body: {
		padding: 15,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: borderColor,
		borderRadius: 15,
		gap: 12,
		backgroundColor: "#fefefe"
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	rowTitle: {
		fontSize: 15,
		color: fontColorFaint
	},
	rowValue: {
		color: fontColorFaint,
		fontSize: 15
	}
})

export default SubscriptionInfo;