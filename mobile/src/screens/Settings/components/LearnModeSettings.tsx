import { StyleSheet, Text, View } from "react-native";
import { borderColor, fontColor, nondescriptColor } from "../../../styles/variables";
import { Ionicons } from '@expo/vector-icons';
import { observer } from "mobx-react-lite";
import settings from "../../../store/settings";
import { useMutation } from "@apollo/client";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "../../../query/settings";
import session from "../../../store/session";
import errorMessage from "@store/toastMessage";
import loadingSpinner from "@store/loadingSpinner";
import SettingsGroup from "./SettingsGroup";
import StyledSelect from "@components/StyledSelect";

const orderOptions = ["default", "random"];
const repetitionOptions = [1, 2, 3, 5, 10];

const LearnModeSettings = observer(function() {
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	async function orderOptionHandler(selected: string) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { phrasesOrder: selected }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	async function repetitionOptionHandler(selected: number) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { repetitionsAmount: selected }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	return (
		<SettingsGroup title="Learning mode">
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					Words order:
				</Text>
				<StyledSelect
					data={orderOptions}
					defaultValue={settings.settings.phrasesOrder}
					onSelect={orderOptionHandler}
					buttonStyle={styles.button}
					buttonTextStyle={styles.buttonText}
					renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
				></StyledSelect>
			</View>
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					Repetitions amount:
				</Text>
				<StyledSelect
					data={repetitionOptions}
					defaultValue={settings.settings.repetitionsAmount}
					onSelect={repetitionOptionHandler}
					buttonStyle={styles.button}
					buttonTextStyle={styles.buttonText}
					renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
				></StyledSelect>
			</View>
		</SettingsGroup>
	)
});

const styles = StyleSheet.create({
	optionContainer: {
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	optionTitle: {
		fontSize: 15
	},
	button: {
		width: 150,
		height: 40,
		borderRadius: 7
	},
	buttonText: {
		fontSize: 15,
		color: fontColor
	}
})

export default LearnModeSettings;