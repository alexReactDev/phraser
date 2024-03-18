import { StyleSheet, Switch, Text, View } from "react-native";
import SettingsGroup from "./SettingsGroup";
import { observer } from "mobx-react-lite";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "@query/settings";
import settings from "@store/settings";
import loadingSpinner from "@store/loadingSpinner";
import errorMessage from "@store/toastMessage";
import session from "@store/session";
import { GET_SUPPORTED_LANGUAGES } from "@query/translation";
import SelectDropdown from "react-native-select-dropdown";
import { borderColor, fontColor, nondescriptColor } from "@styles/variables";
import { Ionicons } from '@expo/vector-icons';
import Loader from "@components/Loaders/Loader";
import WarningMessage from "@components/Errors/WarningMessage";
import { ILanguage } from "@ts/suggestions";

const SuggestionsSettings = observer(function () {
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);
	const { data: languagesData, loading: languagesLoading, error: languagesError } = useQuery(GET_SUPPORTED_LANGUAGES);

	async function disableSuggestionsHandler(value: boolean) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { disableSuggestions: value }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	async function suggestionsLanguageHandler(value: string) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { suggestionsLanguage: value }
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
		<SettingsGroup title="Suggestions">
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					Disable suggestions:
				</Text>
				<Switch
					value={settings.settings.disableSuggestions}
					onValueChange={(newValue) => disableSuggestionsHandler(newValue)}
					trackColor={{false: '#767577', true: '#81b0ff'}}
					thumbColor={'#f4f3f4'}
				></Switch>
			</View>
			<View style={styles.optionContainer}>
				{
					languagesError
					?
					<WarningMessage message={`Failed to get languages list ${languagesError.toString()}`} />
					:
					<>
						<Text style={styles.optionTitle}>
							Suggestions language:
						</Text>
						{
							languagesLoading &&
							<Loader />
						}
						{
							languagesData &&
							<SelectDropdown
								data={languagesData.getSupportedLanguages}
								search
								searchPlaceHolder="Language..."
								renderSearchInputLeftIcon={() => <Ionicons name="search" size={20} color={nondescriptColor} />}
								onSelect={(selectedItem) => suggestionsLanguageHandler(selectedItem.value)}
								buttonStyle={styles.button}
								buttonTextStyle={styles.buttonText}
								buttonTextAfterSelection={(item) => item.name}
								rowTextForSelection={(item) => item.name}
								defaultValue={languagesData.getSupportedLanguages.find((item: ILanguage) => item.value === settings.settings.suggestionsLanguage)}
								renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
							></SelectDropdown>
						}
					</>
				}
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
		borderWidth: 1,
		borderColor: borderColor,
		borderStyle: "solid"
	},
	buttonText: {
		fontSize: 15,
		color: fontColor
	}
});

export default SuggestionsSettings;