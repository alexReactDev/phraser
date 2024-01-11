import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import Highlight from "./components/Hightlight";
import { IPair, IPhrase } from "@ts/phrases";
import { useState, useEffect } from "react";
import Loader from "@components/Loaders/Loader";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../Collections";
import { useQuery } from "@apollo/client";
import { GET_COLLECTION_NAMEID } from "@query/collections";
import { GET_COLLECTION_PHRASES } from "@query/phrases";
import ProgressBar from "../components/ProgressBar";
import AIGeneratedTextController, { IRemembered, IValue, TAIGeneratedTextMode } from "src/classes/AIGeneratedText";
import settings from "@store/settings";
import { observer } from "mobx-react-lite";
import ErrorComponent from "@components/Errors/ErrorComponent";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { IRepetitionInput } from "@ts/repetitions";
import Result from "../components/Result";
import { faintBlue, fontColor } from "@styles/variables";
import ShowHidePhrase from "./components/ShowHidePhrase";

type Props = StackScreenProps<StackNavigatorParams, "AIGeneratedText", "collectionsNavigator">;

interface ProgressData {
	total: number,
	progress: number
}

const AIGeneratedText = observer(function ({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, error: phrasesLoadError } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId }});
	const { data: colData, error: colDataLoadError } = useQuery(GET_COLLECTION_NAMEID, { variables: { id: colId }});

	useEffect(() => {
		if(colData) navigation.setOptions({ title: "AI generated text. Learning " + colData.getCollection.name });
	}, [colData]);

	const [ started, setStarted ] = useState(false);
	const [ finished, setFinished ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ error, setErrorMessage ] = useState("");
	const [ generalError, setGeneralError ] =  useState(null);

	const [ controller, setController ] = useState<AIGeneratedTextController>();
	const [ currentValue, setValue ] = useState<IValue>({ phrases: [], text: [] });
	const [ progress, setProgress ] = useState<ProgressData>({ progress: 0, total: 0});

	const [ mode, setMode ] = useState<TAIGeneratedTextMode>("text");

	const [ stepResults, setStepResults ] = useState<IRemembered>({});
	const [ result, setResult ] = useState<IRepetitionInput | null>(null);

	useEffect(() => {
		if(!data || !colData) return;

		const controller = new AIGeneratedTextController(data.getCollectionPhrases, colData.getCollection, {
			mode: mode, 
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

	}, [data, colData])

	async function nextHandler() {
		setLoading(true);
		setStepResults({});

		let res;

		try {
			res = await (controller!).next(stepResults);
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

	function changeModeHandler() {
		if(mode === "text") {
			controller!.changeMode("sentences");
			setMode("sentences");
		} else {
			controller!.changeMode("text");
			setMode("text");
		}

		regenerateHandler();
	}

	function nextDisabled() {
		let count = 0;

		for(let key in stepResults) {
			count++;
		}

		if(count < currentValue.phrases.length) return true;

		return false;
	}

	if(generalError) return <ErrorComponent message={generalError} />
	if(colDataLoadError) return <ErrorComponent message="Failed to load collection data" />
	if(phrasesLoadError) return <ErrorComponent message="Failed to load collection phrases" />

	if(!started) return <Loader />

	if(finished) return <Result result={result!} />

	return (
		<View>
			<View style={styles.topIndicatorContainer}>
				<ProgressBar progress={progress.progress} total={progress.total} />
			</View>
			<ScrollView style={styles.textScrollContainer} contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}>
					{
						error
						?
						<ErrorComponent message={error} />
						:
						loading
						?
						<Text>Waiting response from ChatGPT...</Text>
						:
						currentValue.text.map((str: string, idx, arr) => {
							const prefix = arr.length > 1 ? idx + 1 + ". " : "";
							const phrases = currentValue.phrases.map((phrase: IPhrase) => ({
								value: phrase.value,
								translation: phrase.translation
							}));

							return (
								<Text style={styles.text} key={str}>
									{prefix}
									{highlightPhrases(phrases, str)}
								</Text>
							)
						})
					}
			</ScrollView>
			<View style={styles.phrasesContainer}>
				{
					currentValue.phrases.map((phrase: IPhrase) => {
						return (
							<View style={styles.phraseContainer} key={phrase.id}>
								<View style={styles.phraseContent}>
									<ShowHidePhrase phrase={phrase} />
								</View>
								<View style={styles.phraseButtons}>
									<TouchableOpacity
										onPress={() => setStepResults({
											...stepResults,
											[phrase.id]: false
										})}
										style={styles.button}
									>
										<Ionicons name="close" size={21} color={stepResults[phrase.id] === false ? "red" : "black"} />
										<Text
											style={styles.buttonText}
										>
											I forgot
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setStepResults({
											...stepResults,
											[phrase.id]: true
										})}
										style={styles.button}
									>
										<Ionicons name="checkmark" size={21} color={stepResults[phrase.id] ? "green" : "black"} />
										<Text
											style={styles.buttonText}
										>
											I remember
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						)
					})
				}
			</View>
			<View style={styles.bottomBtnContainer}>
				<View style={styles.btnContainer}>
					<Button title={mode === "text" ? "Sentences" : "Text"} color={faintBlue} onPress={changeModeHandler}></Button>
				</View>
				<View style={styles.btnContainer}>
					<Button title="Refresh ♻" onPress={regenerateHandler} color={faintBlue}></Button>
				</View>
				<View style={styles.btnContainer}>
					<Button title="Next" onPress={nextHandler} disabled={nextDisabled()}></Button>
				</View>
			</View>
		</View>
	)
});

function highlightPhrases(phrases: IPair[], string: string): any {
	const phrase = phrases[0].value;

	const expression = `\\b${phrase}\\b`;
	const regex = new RegExp(expression, "i");
	const idx = string.search(regex);

	if(idx !== -1) {
		const firstPiece = string.slice(0, idx);
		const secondPiece = string.slice(idx + phrase.length);
		const highlighted = <Highlight value={string.slice(idx, idx + phrase.length)} />

		if(phrases.length === 1) return [firstPiece, highlighted, secondPiece];

		const highlightedFirstPiece = firstPiece ? highlightPhrases(phrases.slice(1), firstPiece) : firstPiece;
		const highlightedSecondPiece = secondPiece ? highlightPhrases(phrases.slice(1), secondPiece) : secondPiece;

		return [...highlightedFirstPiece, highlighted, ...highlightedSecondPiece];
	} else {
		if(phrases.length === 1) return string;

		return highlightPhrases(phrases.slice(1), string);
	}
}

const styles = StyleSheet.create({
	container: {

	},
	topIndicatorContainer: {
		height: "5%",
		justifyContent: "flex-end"
	},
	textScrollContainer: {		
		height: "45%",
		paddingHorizontal: 20
	},
	text: {
		lineHeight: 28,
		marginVertical: 5
	},
	phrasesContainer: {
		height: "40%",
		borderTopWidth: 1,
		borderTopColor: "lightgrey",
		gap: 5
	},
	phraseContainer: {
		paddingHorizontal: 11,
		paddingVertical: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	phraseContent: {
		width: "65%"
	},
	phraseButtons: {
		width: "35%",
		flexDirection: "row",
		gap: 20
	},
	button: {
		alignItems: "center"
	},
	buttonText: {},
	bottomBtnContainer: {
		height: "10%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 10
	},
	btnContainer: {
		width: "33.333%",
		paddingHorizontal: 5
	}
})

export default AIGeneratedText;