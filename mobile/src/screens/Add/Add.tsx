import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { TouchableOpacity, View, TextInput, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontColorFaint,} from "../../styles/variables";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE_COLLECTIONS_FOR_PHRASES } from "../../query/collections";
import { CREATE_PHRASE, GET_COLLECTION_PHRASES } from "../../query/phrases";
import { ICollection, ICollectionMeta } from "@ts/collections";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorParams } from "../../../App";
import settings from "../../store/settings";
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import errorMessage from "@store/toastMessage";
import ModalWithBody from "@components/ModalWithBody";
import EditCollection from "../../components/EditCollection";
import { GET_TRANSLATED_TEXT } from "@query/translation";
import { GET_PREMIUM_DATA } from "@query/premium";
import session from "@store/session";
import globalStyles from "@styles/phraseEditorStyles";
import SelectWithAddBtn from "@components/SelectWithAddBtn";
import SaveBtn from "@components/SaveBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddTutorial from "./components/AddTutorial";
import WelcomeTutorial from "./components/WelcomeTutorial";
import { skipTutorial } from "@utils/tutorial";

type Props = BottomTabScreenProps<NavigatorParams, "Add", "MainNavigator">;

const Add = observer(function ({ route, navigation }: Props) {
	const { data: { getProfileCollections: collections = [] } = {} } = useQuery(GET_PROFILE_COLLECTIONS_FOR_PHRASES, { variables: { id: settings.settings.activeProfile } });
	const { data: { getPremiumData } = {} } = useQuery(GET_PREMIUM_DATA, { variables: { userId: session.data.userId } });
	const [ getSuggestion, { data: suggestionData, loading: suggestionLoading }] = useLazyQuery(GET_TRANSLATED_TEXT);

	const [ createPhrase ] = useMutation(CREATE_PHRASE);

	const [ showSuggestion, setShowSuggestion ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ displayModal, setDisplayModal ] = useState(false);

	const [ showTutorial, setShowTutorial ] = useState(false);
	const [ showWelcomeTutorial, setShowWelcomeTutorial ] = useState(false);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			(async () => {
				const tutorialPassed = await AsyncStorage.getItem("welcomeTutorialPassed");
				if(tutorialPassed !== "true") setShowWelcomeTutorial(true);
			})();

			(async () => {
				const tutorialPassed = await AsyncStorage.getItem("addTutorialPassed");
				if(tutorialPassed !== "true") setShowTutorial(true);
			})();
		});
	  
		return unsubscribe;
	}, []);
	
	const selectRef = useRef<any>(null);
	const translationInputRef = useRef<any>(null);
	
	const filteredCollections = collections.filter((col: ICollection) => !col.isLocked).concat({ id: "CREATE" });

	useEffect(() => {
		if(!formik.values.collection) return;

		const col = collections.find((col: ICollection) => col.id === formik.values.collection);

		if(!col) formik.setFieldValue("collection", "");
		selectRef?.current?.reset();
	}, [settings.settings])

	const formik = useFormik({
		initialValues: {
			value: "",
			translation: "",
			collection: null
		},
		async onSubmit(values) {
			const { collection, ...input } = values;

			const data = {
				value: input.value.trim(),
				translation: input.translation.trim(),
				day: Math.trunc(new Date().getTime() / 86400000)
			};

			loadingSpinner.setLoading();
			setLoading(true);

			try {
				await createPhrase({
					variables: {
						input: data,
						collection
					},
					refetchQueries: [{ query: GET_COLLECTION_PHRASES, variables: { id: collection } }],
					update: (cache, { data: { createPhrase } }) => {
						cache.modify({
							id: `Collection:${collection}`,
							fields: {
								lastUpdate: () => createPhrase.created,
								//@ts-ignore Meta is not a reference
								meta: (oldMeta: ICollectionMeta) => ({
									...oldMeta,
									phrasesCount: oldMeta.phrasesCount + 1
								})
							}
						});

						cache.evict({ fieldName: "searchCollectionPhrases" });
						cache.evict({ fieldName: "searchProfilePhrases" });
					}
				})
			} catch (e: any) {
				console.log(e);
				errorMessage.setErrorMessage(`Failed to create phrase ${e.toString()}`);
				loadingSpinner.dismissLoading();
				setLoading(false);
				return;
			}
			
			loadingSpinner.dismissLoading();
			setLoading(false);
			reset();
		}
	})
	
	useEffect(() => {
		if(settings.settings.disableSuggestions|| !getPremiumData?.hasPremium) return;
		
		if(!formik.values.value || formik.values.translation) {
			if(showSuggestion) setShowSuggestion(false);
			return;
		}

		const timer = setTimeout(() => {
			if(!showSuggestion) setShowSuggestion(true);
			getSuggestion({ variables: { input: formik.values.value }});
		}, 500);

		return () => clearTimeout(timer);
	}, [formik.values.value, formik.values.translation, settings.settings.disableSuggestions])

	function submitHandler() {
		if(loading) return;

		if(!formik.values.value.trim()) {
			errorMessage.setErrorMessage("Please, provide a value");
			return;
		} else if (!formik.values.translation.trim()) {
			errorMessage.setErrorMessage("Please, provide a translation");
			return;
		} else if (!formik.values.collection) {
			errorMessage.setErrorMessage("Please, choose a collection");
			return;
		}

		formik.handleSubmit();
	}

	function reset() {
		formik.resetForm();
		selectRef?.current?.reset();

	}

	async function setTutorialPassed() {
		setShowTutorial(false);
		await AsyncStorage.setItem("addTutorialPassed", "true");
	}

	async function setWelcomeTutorialPassed() {
		setShowWelcomeTutorial(false);
		await AsyncStorage.setItem("welcomeTutorialPassed", "true");
	}

	function skipTutorialHandler() {
		setShowTutorial(false);
		setShowWelcomeTutorial(false);
		skipTutorial();
	}

	return (
		<View
			style={styles.container}
		>
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<EditCollection onReady={() => setDisplayModal(false)} />
			</ModalWithBody>
			<ModalWithBody visible={showWelcomeTutorial} onClose={setWelcomeTutorialPassed}>
				<WelcomeTutorial onClose={setWelcomeTutorialPassed} skipTutorial={skipTutorialHandler} />
			</ModalWithBody>
			<ModalWithBody visible={showTutorial && !showWelcomeTutorial} onClose={setTutorialPassed}>
				<AddTutorial onClose={setTutorialPassed} skipTutorial={skipTutorialHandler} />
			</ModalWithBody>
			<View style={styles.labelContainer}>
				<Text style={{...styles.inputLabel, marginBottom: -2 }}>
					Phrase
				</Text>
				{
					formik.values.value ||
					formik.values.translation ||
					formik.values.collection
					?
					<TouchableOpacity 
						style={styles.close}
						onPress={reset}
						activeOpacity={0.7}
					>
						<Text style={styles.closeText}>
							CLEAR
						</Text>
						<Ionicons name="close-outline" size={21} color={fontColorFaint} />
					</TouchableOpacity>
					:
					null
				}
			</View>
			<TextInput
				onChangeText={formik.handleChange("value")}
				onBlur={() => {
					formik.handleBlur("value");
					translationInputRef?.current?.focus();
				}}
				value={formik.values.value}
				multiline={true}
				style={styles.input}
				placeholder="Enter phrase..."
				autoFocus
				blurOnSubmit
			/>
			<Ionicons name="arrow-down" size={24} color="gray" style={styles.icon} />
			<Text style={{...styles.inputLabel, marginBottom: 6 }}>
				Translation
			</Text>
			<View>
				<TextInput
					onChangeText={formik.handleChange("translation")}
					onBlur={formik.handleBlur("translation")}
					value={formik.values.translation}
					multiline={true}
					style={styles.input}
					ref={translationInputRef}
					placeholder="Enter translation..."
					blurOnSubmit
				/>
				{
					showSuggestion &&
					<View style={styles.suggestion}>
						<View style={styles.suggestionBody}>
							<Text style={styles.suggestionTitle}>
								Suggestion:
							</Text>
							<TouchableOpacity
								style={styles.suggestionValue}
								activeOpacity={0.7}
								onPress={() => formik.setFieldValue("translation", suggestionData.getTranslatedText)}
							>
								<Text style={styles.suggestionValueText}>
									{
										suggestionData?.getTranslatedText.length > 70
										?
										suggestionData.getTranslatedText.slice(0, 70) + "..."
										:
										suggestionData?.getTranslatedText
									}
								</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.suggestionInfo}>
							{
								suggestionLoading &&
								<ActivityIndicator size="small" color="gray"></ActivityIndicator>
							}
						</View>
					</View>
				}
			</View>
			<SelectWithAddBtn
				data={filteredCollections}
				ref={selectRef}
				onSelect={(id: string) => formik.setFieldValue("collection", id)}
				onAdd={() => setDisplayModal(true)}
			></SelectWithAddBtn>
			<SaveBtn onPress={submitHandler} />
		</View>
	)
});

const styles = {
	...globalStyles,
	...StyleSheet.create({
		container: {
			paddingHorizontal: 18,
			paddingVertical: 10,
			position: "relative",
			height: "100%"
		},
		labelContainer: {
			marginBottom: 8,
			flexDirection: "row",
			justifyContent: "space-between"
		},
		inputContainer: {
			position: "relative"	
		},
		suggestion: {
			position: "absolute",
			bottom: 14,
			left: 0,
			width: "100%",
			paddingHorizontal: 8,
			flexDirection: "row",
			justifyContent: "space-between"
		},
		suggestionBody: {
			width: "100%",
			flexDirection: "row",
			gap: 5,
			alignItems: "center",
		},
		suggestionInfo: {
			position: "absolute",
			right: 10,
		},
		suggestionValue: {
			width: "70%",
			flexGrow: 1
		},
		suggestionValueText: {
			color: "grey",
			textDecorationLine: "underline",
			fontStyle: "italic",
			fontSize: 15
		},
		suggestionTitle: {
			maxWidth: "30%",
			fontSize: 16,
			color: "grey",
			fontStyle: "italic"
		},
		icon: {
			marginTop: 11,
			marginBottom: -19,
			alignSelf: "center"
		},
		close: {
			flexDirection: "row",
			alignItems: "center",
			paddingRight: 1
		},
		closeText: {
			color: fontColorFaint,
			textTransform: "uppercase",
			fontSize: 13
		}
	})
}

export default Add;