import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GET_COLLECTION_PHRASES } from "../../../../query/phrases";
import Loader from "../../../../components/Loaders/Loader";
import ErrorComponent from "../../../../components/Errors/ErrorComponent";
import { Ionicons } from '@expo/vector-icons';
import { borderColor, fontColor, fontColorFaint } from "../../../../styles/variables";
import { GET_COLLECTION_NAMEID } from "../../../../query/collections";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../Collections";
import { observer } from "mobx-react-lite";
import settings from "@store/settings";
import { IRepetitionInput } from "@ts/repetitions";
import Result from "../components/Result";
import ProgressBar from "../components/ProgressBar";
import { ProgressData } from "@ts-frontend/learn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalWithBody from "@components/ModalWithBody";
import AssociativePicturesTutorial from "./components/AssociativePicturesTutorial";
import AIGeneratedImage from "src/classes/AIGeneratedImage";

interface PhraseData {
	value: string,
	translation: string
}

type Props = StackScreenProps<StackNavigatorParams, "AssociativePictures", "collectionsNavigator">;

const AssociativePictures = observer(function ({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, error: loadError } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId }});
	const { data: colData } = useQuery(GET_COLLECTION_NAMEID, { variables: { id: colId }});

	useEffect(() => {
		if(colData) navigation.setOptions({ title: "Associative pictures. Learning " + colData.getCollection.name });
	}, [colData]);

	const [ controller, setController ] = useState<AIGeneratedImage | null>(null);
	const [ error, setError ] = useState("");
	const [ delayedError, setDelayedError ] = useState("");

	const [ showTranslation, setShowTranslation ] = useState(false);
	
	const [ previousPhrase, setPreviousPhrase ] = useState("");
	const [ currentPhrase, setCurrentPhrase ] = useState<PhraseData | null>(null);
	const [ loading, setLoading ] = useState(false);

	const [ progress, setProgress ] = useState<ProgressData>({ progress: 0, total: 0});
	
	const [ started, setStarted ] = useState(false);
	const [ finished, setFinished ] = useState(false);
	const [ result, setResult ] = useState<IRepetitionInput | null>(null);

	const [ showTutorial, setShowTutorial ] = useState(false);

	useEffect(() => {
		(async () => {
			const tutorialPassed = await AsyncStorage.getItem("associativePicturesTutorialPassed");
			if(tutorialPassed !== "true") setShowTutorial(true);
		})();
	}, []);

	useEffect(() => {
		if(!data || !colData) return;
		
		const controller = new AIGeneratedImage(data.getCollectionPhrases, colData.getCollection, {
			mode: settings.settings.phrasesOrder!, 
			repetitionsAmount: settings.settings.repetitionsAmount!,
			errorHandler: (e) => setDelayedError(`Failed to get response from AI \n ${e}`)
		});
		setController(controller);
		setProgress((controller!).getProgress());

		(async () => {
			const initialData = await controller.start();
			setCurrentPhrase(initialData.value);
			setStarted(true);
		})();
	}, [data, colData]);

	async function nextHandler(remembered: boolean) {
		if(delayedError) {
			setError(delayedError);
			return;
		}

		let nextData;
		setLoading(true);

		try {
			nextData = await (controller!).next(remembered);
		} catch (e: any) {
			console.log(e);
			setError(`Failed to get response from AI \n ${e}`);
			return;
		}

		setLoading(false);

		if(nextData?.done === true) {
			const result = (controller!).finish();
			setResult(result);
			setFinished(true);
		}

		setPreviousPhrase(`${currentPhrase?.translation}`);
		setCurrentPhrase(nextData.value);
		setProgress((controller!).getProgress());
		setShowTranslation(false);
	}

	async function setTutorialPassed() {
		setShowTutorial(false);
		await AsyncStorage.setItem("associativePicturesTutorialPassed", "true");
	}

	async function refreshHandler() {
		setLoading(true);

		let data;

		try {
			data = await (controller!).generate();
		} catch (e: any) {
			console.log(e);
			setError(`Failed to get response from AI \n ${e}`);
			return;
		}

		setLoading(false);
		setCurrentPhrase({ value: data.url, translation: currentPhrase!.translation });
	}

	if (!started) return <Loader />
	if (loadError) return <ErrorComponent message="Failed to load collection data" />

	if(finished) return <Result result={result!} />

	return (
		<View
			style={style.container}
		>
			<ModalWithBody visible={showTutorial} onClose={setTutorialPassed}>
				<AssociativePicturesTutorial onClose={setTutorialPassed} />
			</ModalWithBody>
			<View
				style={style.adjacentPhrasesContainer}
			>
				<ProgressBar progress={progress.progress} total={progress.total} />
			</View>
			<View
				style={style.currentPhraseContainer}
			>
				{
					error 
					?
					<ErrorComponent message={error} />
					:
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => setShowTranslation(!showTranslation)}
						style={style.currentPhraseCard}
					>
							{
								loading
								?
								<Loader />
								:
								showTranslation
								?
								<Text style={style.currentPhraseText}>
									{(currentPhrase!).translation}
								</Text>
								:
								<Image source={{ uri: currentPhrase?.value }} width={256} height={256} />
							}
					</TouchableOpacity>
				}
			</View>
			<View
				style={style.adjacentPhrasesContainer}
			>
				<Text style={style.adjacentPhrasesTitle}>
					Previous phrase
				</Text>
				<Text
					style={style.ajacentPhrases}
				>
					{previousPhrase}
				</Text>
			</View>
			<View
				style={style.buttonsContainer}
			>
				<TouchableOpacity
					onPress={() => nextHandler(false)}
					style={style.button}
				>
					<Ionicons name="close" size={24} color="#e74c40" />
					<Text
						style={style.buttonText}
					>
						I forgot
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => refreshHandler()}
					style={{...style.button, width: "20%", marginLeft: -2 }}
				>
					<Ionicons name="refresh" size={24} color="#aaa" />
					<Text
						style={{...style.buttonText, color: "#aaa"}}
					>
						Refresh
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => nextHandler(true)}
					style={style.button}
				>
					<Ionicons name="checkmark" size={24} color="green" />
					<Text
						style={style.buttonText}
					>
						I remember
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
});

const style = StyleSheet.create({
	container: {
		height: "100%"
	},
	adjacentPhrasesContainer: {
		height: "10%",
		justifyContent: "center",
		alignItems: "center"
	},
	adjacentPhrasesTitle: {
		marginBottom: 2,
		lineHeight: 20,
		color: fontColorFaint
	},
	ajacentPhrases: {
		paddingHorizontal: 10,
		textAlign: "center",
		lineHeight: 20,
		color: fontColorFaint
	},
	buttonsContainer: {
		height: "30%",
		flexDirection: "row"
	},
	button: {
		width: "40%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	buttonText: {
		color: fontColor,
		fontSize: 16
	},
	currentPhraseContainer: {
		height: "50%",
		justifyContent: "center",
		alignItems: "center"
	},
	currentPhraseCard: {
		position: "relative",
		width: 256,
		height: 256,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: borderColor,
		borderRadius: 10,
		backgroundColor: "#fdfdfd",
		overflow: "hidden"
	},
	currentPhraseText: {
		padding: 10,
		textAlign: "center",
		lineHeight: 21,
		color: fontColor
	}
})

export default AssociativePictures;