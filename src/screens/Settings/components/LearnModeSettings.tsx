import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { borderColor, fontColor, nondescriptColor } from "../../../styles/variables";
import { Ionicons } from '@expo/vector-icons';
import { observer } from "mobx-react-lite";
import settings from "../../../store/settings";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_SETTINGS } from "../../../query/settings";
import session from "../../../store/session";
import ErrorMessageModal from "../../../components/Errors/ErrorMessageModal";
import { useState } from "react";

const orderOptions = ["default", "random"];
const repetitionOptions = [1, 2, 3, 5, 10];

const LearnModeSettings = observer(function() {
	const [ updateUserSettings ] = useMutation(UPDATE_USER_SETTINGS);
	const [ errorMessage, setErrorMessage ] = useState("");

	async function orderOptionHandler(selected: string) {
		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { phrasesOrder: selected }
				}
			})
		} catch (e: any) {
			console.log(e);
			setErrorMessage(e.toString());
		}
	}

	async function repetitionOptionHandler(selected: number) {
		try {
			await updateUserSettings({
				variables: {
					id: session.data.userId,
					input: { repetitionsAmount: selected }
				}
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
				Learn mode settings
			</Text>
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					Words order:
				</Text>
				<SelectDropdown
					data={orderOptions}
					defaultValue={settings.settings.phrasesOrder}
					onSelect={orderOptionHandler}
					buttonStyle={styles.button}
					buttonTextStyle={styles.buttonText}
					renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color={nondescriptColor} />}
				></SelectDropdown>
			</View>
			<View style={styles.optionContainer}>
				<Text style={styles.optionTitle}>
					Repetitions amount:
				</Text>
				<SelectDropdown
					data={repetitionOptions}
					defaultValue={settings.settings.repetitionsAmount}
					onSelect={repetitionOptionHandler}
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

export default LearnModeSettings;