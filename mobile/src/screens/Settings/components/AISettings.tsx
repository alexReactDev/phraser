import { useMutation } from "@apollo/client";
import Tip from "@components/Tip";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "@query/settings";
import settings from "@store/settings";
import { borderColor, fontColor, nondescriptColor } from "@styles/variables";
import { TTextDifficulty } from "@ts/settings";
import { StyleSheet, Switch, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import session from "@store/session";
import errorMessage from "@store/errorMessage";
import loadingSpinner from "@store/loadingSpinner";
import { observer } from "mobx-react-lite";

const textDifficultyValues = [{ text: "Not specified", value: "default"}, { text: "Simple", value: "simple"}, { text: "Average", value: "average"}, { text: "Advanced", value: "advanced" }];

const AISettings = observer(function () {
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	async function useGPT3Handler(value: boolean) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { useGPT3: value }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	async function textDifficultyHandler(value: TTextDifficulty) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { textDifficulty: value }
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
		<View style={styles.container}>
			<Text style={styles.title}>
				AI settings
			</Text>
			<View style={styles.optionContainer}>
				<View style={styles.optionTitleContainer}>
					<Text style={styles.optionTitle}>
						Use GPT3:
					</Text>
					<Tip text="Legacy version of chatGPT may work faster, but give less relevant results"/>
				</View>
				<Switch
					value={settings.settings.useGPT3}
					onChange={() => useGPT3Handler(!settings.settings.useGPT3)}
					trackColor={{false: '#767577', true: '#81b0ff'}}
					thumbColor={'#f4f3f4'}
				></Switch>
			</View>
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					AI generated text difficulty:
				</Text>
				<SelectDropdown
					disabled={settings.settings.disableAutoCollections}
					data={textDifficultyValues}
					defaultValueByIndex={textDifficultyValues.findIndex((item) => item.value === settings.settings.textDifficulty)}
					onSelect={(selected) => textDifficultyHandler(selected.value)}
					rowTextForSelection={(item) => item.text}
					buttonTextAfterSelection={(item) => item.text}
					buttonStyle={styles.button}
					buttonTextStyle={styles.buttonText}
					renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
				></SelectDropdown>
			</View>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		margin: 10,
		padding: 10,
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: borderColor,
		borderRadius: 5,
		backgroundColor: "#fefefe"
	},
	title: {
		fontSize: 21,
		color: fontColor,
		marginBottom: 10
	},
	optionContainer: {
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	optionTitleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 2
	},
	optionTitle: {
		fontSize: 15
	},
	button: {
		width: 150,
		height: 40,
		borderWidth: 1,
		borderColor: borderColor,
		borderStyle: "solid"
	},
	buttonText: {
		fontSize: 15,
		color: fontColor
	}
})

export default AISettings;