import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GET_COLLECTION_PHRASES } from "../../../../query/phrases";
import Loader from "../../../../components/Loaders/Loader";
import ErrorComponent from "../../../../components/Errors/ErrorComponent";
import { Ionicons } from '@expo/vector-icons';
import { borderColor, fontColor, fontColorFaint } from "../../../../styles/variables";
import { GET_COLLECTION_NAMEID } from "../../../../query/collections";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../../Collections";
import Cards from "src/classes/Cards";
import { observer } from "mobx-react-lite";
import settings from "@store/settings";
import { IRepetition, IRepetitionInput } from "@ts/repetitions";
import Result from "../components/Result";
import ProgressBar from "../components/ProgressBar";
import { ProgressData } from "@ts-frontend/learn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalWithBody from "@components/ModalWithBody";
import CardsTutorial from "./components/CardsTutorial";

interface PhraseData {
	value: string,
	translation: string
}

type Props = StackScreenProps<StackNavigatorParams, "Cards", "collectionsNavigator">;

const Learn = observer(function ({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, error } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId }});
	const { data: colData } = useQuery(GET_COLLECTION_NAMEID, { variables: { id: colId }});

	useEffect(() => {
		if(colData) navigation.setOptions({ title: "Cards. Learning " + colData.getCollection.name });
	}, [colData]);

	const [ controller, setController ] = useState<Cards | null>(null);

	const [ showTranslation, setShowTranslation ] = useState(false);
	
	const [ previousPhrase, setPreviousPhrase ] = useState("-");
	const [ currentPhrase, setCurrentPhrase ] = useState<PhraseData | null>(null);

	const [ progress, setProgress ] = useState<ProgressData>({ progress: 0, total: 0});
	
	const [ started, setStarted ] = useState(false);
	const [ finished, setFinished ] = useState(false);
	const [ result, setResult ] = useState<IRepetitionInput | null>(null);

	const [ showTutorial, setShowTutorial ] = useState(false);

	useEffect(() => {
		(async () => {
			const tutorialPassed = await AsyncStorage.getItem("cardsTutorialPassed");
			if(tutorialPassed !== "true") setShowTutorial(true);
		})();
	}, []);

	useEffect(() => {
		if(!data || !colData) return;
		
		const controller = new Cards(data.getCollectionPhrases, colData.getCollection, {
			mode: settings.settings.phrasesOrder!, 
			repetitionsAmount: settings.settings.repetitionsAmount!
		});
		const initialData = controller.start();
		setController(controller);
		setCurrentPhrase(initialData.value);
		setProgress((controller!).getProgress());
		setStarted(true);
	}, [data, colData]);

	function nextHandler(remembered: boolean) {
		const nextData = (controller!).next(remembered);

		if(nextData?.done === true) {
			const result = (controller!).finish();
			setResult(result);
			setFinished(true);
		}

		setPreviousPhrase(`${currentPhrase?.value}: ${currentPhrase?.translation}`);
		setCurrentPhrase(nextData?.value);
		setProgress((controller!).getProgress());
		setShowTranslation(false);
	}

	async function setTutorialPassed() {
		setShowTutorial(false);
		await AsyncStorage.setItem("cardsTutorialPassed", "true");
	}

	if (!started) return <Loader />
	if (error) return <ErrorComponent message="Failed to load collection data" />

	if(finished) return <Result result={result!} />

	return (
		<View
			style={style.container}
		>
			<ModalWithBody visible={showTutorial} onClose={setTutorialPassed}>
				<CardsTutorial onClose={setTutorialPassed} />
			</ModalWithBody>
			<View
				style={style.progressContainer}
			>
				<ProgressBar progress={progress.progress} total={progress.total} />
			</View>
			<View
				style={style.currentPhraseContainer}
			>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => setShowTranslation(!showTranslation)}
					style={style.currentPhraseCard}
				>
					<View
						style={style.currentPhraseIcon}
					>
						<Text
							style={style.currentPhraseIconText}
						>
							{
								showTranslation
								?
								"🐵"
								:
								"🙈"
							}
						</Text>
					</View>
					<Text
						style={style.currentPhraseText}
					>
						{
							showTranslation
							?
							(currentPhrase!).translation
							:
							(currentPhrase!).value
						}
					</Text>
				</TouchableOpacity>
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
					<Ionicons name="close" size={24} color="black" />
					<Text
						style={style.buttonText}
					>
						I forgot
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => nextHandler(true)}
					style={style.button}
				>
					<Ionicons name="checkmark" size={24} color="black" />
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
	progressContainer: {
		height: "10%",
		justifyContent: "center",
		alignItems: "center",
	},
	adjacentPhrasesContainer: {
		height: "10%",
		alignSelf: "center",
		marginHorizontal: 10,
		paddingVertical: 5,
		paddingHorizontal: 8,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff99"
	},
	adjacentPhrasesTitle: {
		marginBottom: 2,
		lineHeight: 20,
		color: fontColor
	},
	ajacentPhrases: {
		paddingHorizontal: 10,
		textAlign: "center",
		lineHeight: 20,
		color: fontColor
	},
	buttonsContainer: {
		height: "30%",
		flexDirection: "row"
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
	currentPhraseContainer: {
		height: "50%",
		justifyContent: "center",
		alignItems: "center"
	},
	currentPhraseCard: {
		position: "relative",
		width: 200,
		height: 200,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: borderColor,
		borderRadius: 15,
		backgroundColor: "#fdfdfdf5",
		elevation: 2
	},
	currentPhraseText: {
		padding: 10,
		textAlign: "center",
		lineHeight: 21,
		color: fontColor
	},
	currentPhraseIcon: {
		position: "absolute",
		top: 5,
		right: 10
	},
	currentPhraseIconText: {
		fontSize: 24
	}
})

export default Learn;