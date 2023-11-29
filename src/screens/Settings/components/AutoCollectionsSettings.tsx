import { useMutation } from "@apollo/client";
import ErrorMessageModal from "@components/Errors/ErrorMessageModal";
import { GET_USER_SETTING, UPDATE_USER_SETTINGS } from "@query/settings";
import { borderColor, fontColor, nondescriptColor } from "@styles/variables";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Ionicons } from '@expo/vector-icons';
import settings from "@store/settings";
import { observer } from "mobx-react-lite";
import session from "@store/session";
import Tip from "@components/Tip";
import { TIntervalRepetitionDates } from "@ts/settings";

const autoCollectionSizeOptions = [{ text: "30 phrases", value: 30 }, { text: "50 phrases", value: 50 }, { text: "70 phrases", value: 70 }];
const intervalRepetitionDatesOptions = ["auto", "exact", "extended"];

const AutoCollectionsSettings = observer(function() {
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);
	const [ errorMessage, setErrorMessage ] = useState("");

	async function autoCollectionSizeHandler(value: number) {
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
			setErrorMessage(e.toString());
		}
	}

	async function intervalRepetitionDatesHandler(value: TIntervalRepetitionDates) {
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
			setErrorMessage(e.toString());
		}
	}

	async function disableAutoCollectionsHandler(value: boolean) {
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
			setErrorMessage(e.toString());
		}
	}

	return (
		<View style={styles.container}>
			{
				errorMessage && <ErrorMessageModal errorMessage={errorMessage} onClose={() => setErrorMessage("")} />
			}
			<Text style={styles.title}>
				Auto collections
			</Text>
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
				<SelectDropdown
					disabled={settings.settings.disableAutoCollections}
					data={autoCollectionSizeOptions}
					defaultValueByIndex={autoCollectionSizeOptions.findIndex((item) => item.value === settings.settings.autoCollectionsSize)}
					onSelect={(selected) => autoCollectionSizeHandler(selected.value)}
					rowTextForSelection={(item) => item.text}
					buttonTextAfterSelection={(item) => item.text}
					buttonStyle={styles.button}
					buttonTextStyle={styles.buttonText}
					renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
				></SelectDropdown>
			</View>
			<View style={styles.optionContainer}>
				<View style={styles.optionTitleContainer}>
					<Text style={styles.optionTitle}>
						Interval collection dates:
					</Text>
					<Tip text={"If \"exact\" is set, interval collection will only include words you saved 1, 7, 30 and 90 days ago.\n\nIf \"extended\", it will also include words from neighboring dates.\n\nIf \"auto\", exact will be used by default, but if amount of words is less than specified in auto collection size it will be switched to \"extended\"."} />
				</View>
				<SelectDropdown
					disabled={settings.settings.disableAutoCollections}
					data={intervalRepetitionDatesOptions}
					defaultValue={settings.settings.intervalRepetitionDates}
					onSelect={intervalRepetitionDatesHandler}
					rowTextForSelection={(item: string) => item[0].toUpperCase() + item.slice(1)}
					buttonTextAfterSelection={(item: string) => item[0].toUpperCase() + item.slice(1)}
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


export default AutoCollectionsSettings;