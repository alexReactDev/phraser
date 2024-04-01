import { useQuery } from "@apollo/client";
import ErrorComponent from "@components/Errors/ErrorComponent";
import Loader from "@components/Loaders/Loader";
import { GET_PROFILE_COLLECTIONS_COUNT } from "@query/collections";
import { GET_PROFILE_PHRASES_COUNT } from "@query/phrases";
import { GET_USER } from "@query/user";
import session from "@store/session";
import settings from "@store/settings";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import { default as commonStyles } from "../styles/styles";
import moment from "moment";
import { nondescriptColor } from "@styles/variables";

const OtherStats = observer(function () {
	const { data: collectionsData, loading: collectionsDataLoading, error: collectionsDataError } = useQuery(GET_PROFILE_COLLECTIONS_COUNT, { variables: { profileId: settings.settings.activeProfile }});
	const { data: phrasesData, loading: phrasesDataLoading, error: phrasesDataError } = useQuery(GET_PROFILE_PHRASES_COUNT, { variables: { profileId: settings.settings.activeProfile }});
	const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(GET_USER, { variables: { id: session.data.userId }});

	if (
		collectionsDataLoading
		|| phrasesDataLoading
		|| userDataLoading
	) return <Loader />

	if (
		collectionsDataError
		|| phrasesDataError
		|| userDataError
	) return <ErrorComponent message="Failed to load data" />

	const joinDate = moment(userData.getUser.created).format("D.MM.YYYY");
	const daysAgo = moment(new Date().getTime()).diff(moment(userData.getUser.created), "days");

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Other stats
			</Text>
			<View style={styles.card}>
				<View style={styles.body}>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Total phrases:
						</Text>
						<Text style={styles.rowValue}>
							{phrasesData.getProfilePhrasesCount}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Total collections:
						</Text>
						<Text style={styles.rowValue}>
							{collectionsData.getProfileCollectionsCount}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.rowName}>
							Joined:
						</Text>
						<Text style={styles.rowValue}>
							{`${joinDate} (${daysAgo} day(s) ago)`}
						</Text>
					</View>
				</View>
			</View>
		</View>
	)
});

const styles = {
	...commonStyles,
	...StyleSheet.create({
		card: {
			marginBottom: 15,
			borderStyle: "solid",
			borderColor: nondescriptColor,
			borderWidth: 1,
			borderRadius: 5,
			paddingVertical: 10,
			paddingHorizontal: 10,
			backgroundColor: "#fefefe"
		},
		body: {
			gap: 10,
			paddingHorizontal: 2
		}
	})
}

export default OtherStats;