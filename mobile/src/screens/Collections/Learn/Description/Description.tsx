import { StackScreenProps } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StackNavigatorParams } from "../../Collections";
import { useQuery } from "@apollo/client";
import { GET_COLLECTION_PHRASES } from "@query/phrases";
import { GET_COLLECTION_NAMEID } from "@query/collections";
import ErrorComponent from "@components/Errors/ErrorComponent";
import Loader from "@components/Loaders/Loader";
import { ProgressData } from "@ts-frontend/learn";
import { Description as DescriptionController, IValue } from "src/classes/Description";
import ProgressBar from "../components/ProgressBar";
import { Ionicons } from '@expo/vector-icons';
import { borderColor, fontColor, fontColorFaint, nondescriptColor } from "@styles/variables";
import settings from "@store/settings";
import { observer } from "mobx-react-lite";
import { IRepetitionInput } from "@ts/repetitions";
import Result from "../components/Result";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalWithBody from "@components/ModalWithBody";
import DescriptionTutorial from "./components/DescriptionTutorial";

type Props = StackScreenProps<StackNavigatorParams, "Description", "collectionsNavigator">;

const Description = observer(function({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, error: phrasesLoadError } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId }});
	const { data: colData, error: colDataLoadError } = useQuery(GET_COLLECTION_NAMEID, { variables: { id: colId }});

	useEffect(() => {
		if(colData) navigation.setOptions({ title: "Description. Learning " + colData.getCollection.name });
	}, [colData]);

	const [ started, setStarted ] = useState(false);
	const [ finished, setFinished ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ error, setErrorMessage ] = useState("");
	const [ generalError, setGeneralError ] =  useState(null);

	const [ controller, setController ] = useState<DescriptionController>();
	const [ currentValue, setValue ] = useState<IValue>();
	const [ progress, setProgress ] = useState<ProgressData>({ progress: 0, total: 1});

	const [ result, setResult ] = useState<IRepetitionInput | null>(null);

	const [ showPhrase, setShowPhrase ] = useState(false);

	const [ showTutorial, setShowTutorial ] = useState(false);

	useEffect(() => {
		(async () => {
			const tutorialPassed = await AsyncStorage.getItem("descriptionTutorialPassed");
			if(tutorialPassed !== "true") setShowTutorial(true);
		})();
	}, [])

	useEffect(() => {
		if(!data || !colData) return;

		const controller = new DescriptionController(data.getCollectionPhrases, colData.getCollection, {
			repetitionsAmount: settings.settings.repetitionsAmount!
		});

		setController(controller);

		(async () => {
			let initialData;

			try {
				initialData = await controller.start();
			} catch(e: any) {
				setGeneralError(e);
				return;
			}

			setValue(initialData.value);
			setProgress(controller.getProgress());
			setStarted(true);
		})();

	}, [data, colData]);

	async function nextHandler(remembered: boolean) {
		setLoading(true);

		let res;

		try {
			res = await (controller!).next(remembered);
		} catch(e: any) {
			setErrorMessage(e);
			return;
		}

		if(res.done) {
			setResult((controller!).finish());
			setFinished(true);
			return;
		}

		setProgress(controller!.getProgress());
		setValue(res.value!);
		setLoading(false);
	}

	async function regenerateHandler() {
		setLoading(true);

		let value;

		try {
			value = await (controller!).generate();
		} catch(e: any) {
			setErrorMessage(e);
			return;
		}

		setValue(value);
		setLoading(false);
	}

	async function setTutorialPassed() {
		setShowTutorial(false);
		await AsyncStorage.setItem("descriptionTutorialPassed", "true");
	}

	if(generalError) return <ErrorComponent message={generalError} />
	if(colDataLoadError) return <ErrorComponent message="Failed to load collection data" />
	if(phrasesLoadError) return <ErrorComponent message="Failed to load collection phrases" />

	if(!started) return <Loader />

	if(finished) return <Result result={result!} />

	return (
		<View style={styles.container}>
			<ModalWithBody visible={showTutorial} onClose={setTutorialPassed}>
				<DescriptionTutorial onClose={setTutorialPassed} />
			</ModalWithBody>
			<View style={styles.topIndicator}>
				<ProgressBar progress={progress.progress} total={progress.total} />
			</View>
			<View style={styles.hintContainer}>
				<ScrollView style={styles.hintScrollContainer} contentContainerStyle={{ justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
					<Text style={styles.hint}>
						{
							error
							?
							<ErrorComponent message={error} />
							:
							loading
							?
							<Text>Waiting response from ChatGPT...</Text>
							:
							currentValue?.hint
						}
					</Text>
				</ScrollView>
				<TouchableOpacity 
					style={styles.refreshBtnContainer}
					activeOpacity={0.8}
					onPress={regenerateHandler}
				>
					<Text style={styles.refreshBtn}>
						REFRESH ♻
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.phraseContainer}>
				<TouchableOpacity 
					style={{...styles.phraseCard, borderStyle: showPhrase ? "solid" : "dashed" }}
					onPress={() => setShowPhrase(!showPhrase)}
					activeOpacity={0.8}
				>
					<View style={styles.phraseCardIcon}>
						<Text style={styles.phraseCardIconText}>
							{
								showPhrase
								?
								"🐵"
								:
								"🙈"
							}
						</Text>
					</View>
					{
						showPhrase
						?
						<View style={styles.phrase}>
							<Text style={styles.phraseValue}>
								{currentValue?.phrase.value}
							</Text>
							<View style={styles.phraseDivider} />
							<Text style={styles.phraseTranslation}>
								{currentValue?.phrase.translation}
							</Text>
						</View>
						:
						<Text style={styles.phrasePlaceholder}>
							?
						</Text>
					}
				</TouchableOpacity>
			</View>
			<View style={styles.buttonsContainer}>
				<TouchableOpacity
					onPress={() => nextHandler(false)}
					style={styles.button}
				>
					<Ionicons name="close" size={24} color="black" />
					<Text
						style={styles.buttonText}
					>
						I forgot
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => nextHandler(true)}
					style={styles.button}
				>
					<Ionicons name="checkmark" size={24} color="black" />
					<Text
						style={styles.buttonText}
					>
						I remember
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {

	},
	topIndicator: {
		height: "5%",
		justifyContent: "flex-end"
	},
	hintContainer: {
		position: "relative",
		height: "40%",
		paddingHorizontal: 20,
		borderStyle: "solid",
		borderBottomWidth: 1,
		borderColor: "lightgrey"
	},
	hintScrollContainer: {

	},
	hint: {
		lineHeight: 22,
		fontStyle: "italic"
	},
	phraseContainer: {
		height: "40%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f7f7f7e5"
	},
	phraseCard: {
		position: "relative",
		width: "50%",
		height: "70%",
		borderRadius: 10,
		borderColor: nondescriptColor,
		borderWidth: 1,
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f8f8ee"
	},
	phraseCardIcon: {
		position: "absolute",
		top: 2,
		right: 8
	},
	phraseCardIconText: {
		fontSize: 21
	},
	phrasePlaceholder: {
		fontSize: 21,
		color: fontColor
	},
	phrase: {
		gap: 10,
		alignItems: "center"
	},
	phraseValue: {
		textAlign: "center",
		color: fontColor
	},
	phraseDivider: {
		width: 80,
		height: 1,
		backgroundColor: borderColor
	},
	phraseTranslation: {
		textAlign: "center",
		color: fontColor
	},
	refreshBtnContainer: {
		position: "absolute",
		bottom: 12,
		right: 12,
		paddingVertical: 5,
		paddingHorizontal: 8,
		borderRadius: 8,
		backgroundColor: "#f7f7f7bb"
	},
	refreshBtn: {
		fontSize: 13,
		color: "#6a6a6a"
	},
	buttonsContainer: {
		height: "15%",
		flexDirection: "row",
		backgroundColor: "#f7f7f7e5"
	},
	button: {
		width: "50%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	buttonText: {
		color: fontColor,
		fontSize: 16
	},
})

export default Description;