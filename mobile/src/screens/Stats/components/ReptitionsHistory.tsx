import { useQuery } from "@apollo/client";
import ErrorComponent from "@components/Errors/ErrorComponent";
import Loader from "@components/Loaders/Loader";
import { GET_PROFILE_REPETITIONS } from "@query/repetitions";
import settings from "@store/settings";
import { IRepetition } from "@ts/repetitions";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import Repetition from "./Repetition";
import { default as commonStyles } from "../styles/styles";

const RepetitionsHistory = observer(function() {
	const { data, loading, error } = useQuery(GET_PROFILE_REPETITIONS, { variables: { profileId: settings.settings.activeProfile }});

	console.log(error);

	if(error) return <ErrorComponent message="Failed to load repetitions" />
	if(loading) return <Loader />

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Repetitions history
			</Text>
			<View style={styles.repetitionsContainer}>
				{
					data.getProfileRepetitions.map((repetition: IRepetition) => <Repetition key={repetition.id} repetition={repetition} />)
				}
			</View>
		</View>
	)
});

const styles = {
	...commonStyles,
	...StyleSheet.create({
		repetitionsContainer: {
			gap: 8
		}
	})
}

export default RepetitionsHistory;