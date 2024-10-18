import { useMutation } from "@apollo/client";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "@query/settings";
import { fontColor, nondescriptColor } from "@styles/variables";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import settings from "@store/settings";
import { observer } from "mobx-react-lite";
import session from "@store/session";
import Tip from "@components/Tip";
import { TIntervalRepetitionDates } from "@ts/settings";
import errorMessage from "@store/toastMessage";
import loadingSpinner from "@store/loadingSpinner";
import SettingsGroup from "./SettingsGroup";
import StyledSelect from "@components/StyledSelect";

const autoCollectionSizeOptions = [{ text: "30 phrases", value: 30 }, { text: "50 phrases", value: 50 }, { text: "70 phrases", value: 70 }];
const intervalRepetitionDatesOptions = ["auto", "exact", "extended"];

const AutoCollectionsSettings = observer(function() {
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);

	async function autoCollectionSizeHandler(value: number) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { autoCollectionsSize: value }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	async function intervalRepetitionDatesHandler(value: TIntervalRepetitionDates) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { intervalRepetitionDates: value }
				},
				refetchQueries: [ GET_USER_SETTING ]
			})
		} catch (e: any) {
			console.log(e);
			errorMessage.setErrorMessage(e.toString());
		}

		loadingSpinner.dismissLoading();
	}

	async function disableAutoCollectionsHandler(value: boolean) {
		loadingSpinner.setLoading();

		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { disableAutoCollections: value }
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
		<SettingsGroup title="Auto collections">
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					Disable auto collections:
				</Text>
				<Switch
					value={settings.settings.disableAutoCollections}
					onChange={() => disableAutoCollectionsHandler(!settings.settings.disableAutoCollections)}
					trackColor={{false: '#767577', true: '#81b0ff'}}
					thumbColor={'#f4f3f4'}
				></Switch>
			</View>
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					Auto collections size:
				</Text>
				<StyledSelect
					disabled={settings.settings.disableAutoCollections}
					data={autoCollectionSizeOptions}
					defaultValueByIndex={autoCollectionSizeOptions.findIndex((item) => item.value === settings.settings.autoCollectionsSize)}
					onSelect={(selected) => autoCollectionSizeHandler(selected.value)}
					rowTextForSelection={(item) => item.text}
					buttonTextAfterSelection={(item) => item.text}
					buttonStyle={styles.button}
					buttonTextStyle={styles.buttonText}
					renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
				></StyledSelect>
			</View>
			<View style={styles.optionContainer}>
				<View style={styles.optionTitleContainer}>
					<Text style={styles.optionTitle}>
						Interval collection dates:
					</Text>
					<Tip text={"If \"exact\" is set, interval collection will only include words you saved 1, 7, 30 and 90 days ago.\n\nIf \"extended\", it will also include words from neighboring dates.\n\nIf \"auto\", exact will be used by default, but if amount of words is less than specified in auto collection size it will be switched to \"extended\"."} />
				</View>
				<StyledSelect
					disabled={settings.settings.disableAutoCollections}
					data={intervalRepetitionDatesOptions}
					defaultValue={settings.settings.intervalRepetitionDates}
					onSelect={intervalRepetitionDatesHandler}
					rowTextForSelection={(item: string) => item[0].toUpperCase() + item.slice(1)}
					buttonTextAfterSelection={(item: string) => item[0].toUpperCase() + item.slice(1)}
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
		borderRadius: 7
	},
	buttonText: {
		fontSize: 15,
		color: fontColor
	}
})


export default AutoCollectionsSettings;