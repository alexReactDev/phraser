import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GET_COLLECTION_PHRASES } from "../../../query/phrases";
import Loader from "../../../components/Loader";
import ErrorComponent from "../../../components/Errors/ErrorComponent";
import { IPhrase } from "../../../types/phrases";
import { Ionicons } from '@expo/vector-icons';
import { borderColor, fontColor, fontColorFaint } from "../../../styles/variables";
import { CREATE_COLLECTION_REPETITION, MUTATE_PHRASES_META } from "../../../query/repetitions";
import { GET_COLLECTION_NAMEID } from "../../../query/collections";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";

type Props = StackScreenProps<StackNavigatorParams, "Learn", "collectionsNavigator">;

function Learn({ route, navigation }: Props) {
	const colId = route.params.colId;

	const { data, loading, error } = useQuery(GET_COLLECTION_PHRASES, { variables: { id: colId }});
	const phrasesData = data?.getCollectionPhrases;

	const { data: colData } = useQuery(GET_COLLECTION_NAMEID, { variables: { id: colId }});

	const [ mutatePhrasesMeta ] = useMutation(MUTATE_PHRASES_META);
	const [ createCollectionRepetition ] = useMutation(CREATE_COLLECTION_REPETITION);

	const [ started, setStarted ] = useState(false);
	const [ phrases, setPhrases ] = useState<number[]>([]);
	const [ phrasesRepetitions, setPhrasesRepetitions ] = useState<IPhraseRepetition[]>([]);
	const [ showTranslation, setShowTranslation ] = useState(false);
	const [ currentPhrase, setCurrentPhrase ] = useState<number>();
	const [ previousPhrase, setPreviousPhrase ] = useState("previous phrase: some phrase");
	const [ incomingPhrase, setIncomingPhrase ] = useState("");
	const [ finished, setFinished ] = useState(false);
	const [ result, setResult ] = useState<IRepetition | null>(null);

	useEffect(() => {
		if(finished) finishHandler();
	}, [finished]);

	useEffect(() => {
		if(colData) navigation.setOptions({ title: "Learn " + colData.getCollection.name });
	}, [colData])

	function startHandler() {
		const phrases = phrasesData.map((phrase: IPhrase) => phrase.id);
		setPhrases(phrases);
		setPhrasesRepetitions(phrases.map((id: number) => ({
			id,
			guessed: 0,
			forgotten: 0,
			repeated: 0
		})))
		setCurrentPhrase(phrases[0]);
		setIncomingPhrase(phrasesData.find((phrase: IPhrase) => phrase.id === phrases[1]).value + ": ?");
		setStarted(true);
	}

	function nextHandler(remembered: boolean) {
		let newPhrases = phrases.filter((p, index) => index !== 0);
		if(!remembered) newPhrases = [...newPhrases, currentPhrase!]

		const phraseRepetitionData: IPhraseRepetition = phrasesRepetitions.find((phraseRepetition: IPhraseRepetition) => phraseRepetition.id === currentPhrase)!;
		let newPhraseRepetitionData = {
			...phraseRepetitionData,
			repeated: phraseRepetitionData!.repeated + 1
		}

		if(remembered) {
			newPhraseRepetitionData = {
				...newPhraseRepetitionData,
				guessed: newPhraseRepetitionData.guessed! + 1
			}
		} else {
			newPhraseRepetitionData = {
				...newPhraseRepetitionData,
				forgotten: newPhraseRepetitionData.forgotten! + 1
			}
		}

		setPhrasesRepetitions(phrasesRepetitions.filter((repetition) => repetition.id !== currentPhrase).concat([newPhraseRepetitionData]));

		if(newPhrases.length === 0) return setFinished(true);

		setPhrases(newPhrases);

		const currentPhraseData = phrasesData.find((phrase: IPhrase) => phrase.id === currentPhrase);
		setPreviousPhrase(currentPhraseData.value + ": " + currentPhraseData.translation);

		const incomingPhraseData = phrasesData.find((phrase: IPhrase) => phrase.id === newPhrases[1]);
		setIncomingPhrase(incomingPhraseData ? incomingPhraseData.value + ": ?" : "");

		setCurrentPhrase(newPhrases[0]);
		setShowTranslation(false);
	}

	function finishHandler() {
		let repetitionData: Partial<IRepetition> = phrasesRepetitions.reduce((meta, phraseRepetition) => {
			return {
				phrasesCount: meta.phrasesCount + 1,
				totalGuessed: meta.totalGuessed + phraseRepetition.guessed,
				totalForgotten: meta.totalForgotten + phraseRepetition.forgotten,
				totalRepeated: meta.totalRepeated + phraseRepetition.repeated
			}
		}, {
			totalRepeated: 0,
			totalGuessed: 0,
			totalForgotten: 0,
			phrasesCount: 0
		})

		repetitionData = {
			...repetitionData,
			created: new Date().getTime(),
			phrasesRepetitions
		};

		setResult(repetitionData as IRepetition);

		createCollectionRepetition({
			variables: {
				id: colId,
				input: repetitionData
			}
		});

		mutatePhrasesMeta({
			variables: {
				input: phrasesRepetitions
			}
		});
	}

	if (loading) return <Loader />
	if (error) return <ErrorComponent message="Failed to load collection data" />

	if(!started) return (
		<View 
			style={style.demoContainer}
		>
			<Button 
				title="Start"
				onPress={startHandler}
			/>
		</View>
	)

	if(finished) return (
		<View 
			style={style.demoContainer}
		>
			<Text
				style={style.doneTitle}
			>
				Done!
			</Text>
			<Text
				style={style.resultTitle}
			>
				Result:
			</Text>
			<Text
				style={style.metaText}
			>
				Phrases count: {result?.phrasesCount}
			</Text>
			<Text
				style={style.metaText}
			>
				Repeated: {result?.totalRepeated}
			</Text>
			<Text
				style={style.metaText}
			>
				Guessed: {result?.totalGuessed}
			</Text>
			<Text
				style={style.metaText}
			>
				Forgotten: {result?.totalForgotten}
			</Text>
		</View>
	)

	return (
		<View
			style={style.container}
		>
			<View
				style={style.adjacentPhrasesContainer}
			>
				<Text
					style={style.ajacentPhrases}
				>
					{previousPhrase}
				</Text>
			</View>
			<View
				style={style.currentPhraseContainer}
			>
				<TouchableOpacity
					activeOpacity={0.8}
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
							phrasesData.find((phrase: IPhrase) => phrase.id === currentPhrase).translation
							:
							phrasesData.find((phrase: IPhrase) => phrase.id === currentPhrase).value
						}
					</Text>
				</TouchableOpacity>
			</View>
			<View
				style={style.adjacentPhrasesContainer}
			>
				<Text
					style={style.ajacentPhrases}
				>
					{incomingPhrase}
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
}

const style = StyleSheet.create({
	demoContainer: {
		height: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	container: {
		height: "100%"
	},
	adjacentPhrasesContainer: {
		height: "10%",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	ajacentPhrases: {
		color: fontColorFaint
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
		borderRadius: 10,
		backgroundColor: "#fdfdfd"
	},
	currentPhraseText: {
		color: fontColor
	},
	currentPhraseIcon: {
		position: "absolute",
		top: 5,
		right: 10
	},
	currentPhraseIconText: {
		fontSize: 24
	},
	doneTitle: {
		fontSize: 24,
		marginBottom: 15
	},
	resultTitle: {
		fontSize: 18,
		marginBottom: 5
	},
	metaText: {
		marginBottom: 4
	}
})

export default Learn;