import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { TouchableOpacity, View, TextInput, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontColor, fontColorFaint,} from "../../styles/variables";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE_COLLECTIONS_FOR_PHRASES } from "../../query/collections";
import SelectDropdown from "react-native-select-dropdown";
import { CREATE_PHRASE, GET_COLLECTION_PHRASES, GET_PHRASE, MOVE_PHRASE, MUTATE_PHRASE } from "../../query/phrases";
import { ICollection, ICollectionMeta } from "@ts/collections";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorParams } from "../../../App";
import settings from "../../store/settings";
import { observer } from "mobx-react-lite";
import loadingSpinner from "@store/loadingSpinner";
import errorMessage from "@store/errorMessage";
import LoaderModal from "@components/Loaders/LoaderModal";
import ModalWithBody from "@components/ModalWithBody";
import EditCollection from "../Collections/components/EditCollection";
import { GET_TRANSLATED_TEXT } from "@query/translation";

type Props = BottomTabScreenProps<NavigatorParams, "Add", "MainNavigator">;

const Add = observer(function ({ route, navigation }: Props) {
	const [ showSuggestion, setShowSuggestion ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const { data: { getProfileCollections: collections = [] } = {} } = useQuery(GET_PROFILE_COLLECTIONS_FOR_PHRASES, { variables: { id: settings.settings.activeProfile } });
	const { data: { getPhrase: phraseData } = {}, loading: phraseLoading } = useQuery(GET_PHRASE, { variables: { id: route.params?.mutateId }, skip: !route.params?.mutateId });
	const [ createPhrase ] = useMutation(CREATE_PHRASE);
	const [ mutatePhrase ] = useMutation(MUTATE_PHRASE);
	const [ movePhrase ] = useMutation(MOVE_PHRASE);
	const selectRef = useRef<any>(null);
	const translationInputRef = useRef<any>(null);
	
	const [ displayModal, setDisplayModal ] = useState(false);

	const filteredCollections = collections.filter((col: ICollection) => !col.isLocked || col.id === phraseData?.collection).concat({ id: "CREATE" });

	useEffect(() => {
		if(phraseData) {
			formik.setFieldValue("value", phraseData.value);
			formik.setFieldValue("translation", phraseData.translation);
			formik.setFieldValue("collection", phraseData.collection);
			selectRef?.current?.selectIndex(filteredCollections.findIndex((col: ICollection) => col.id == phraseData.collection));
			navigation.setOptions({
				title: `Edit`
			});
		}
	}, [phraseData]);

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
				translation: input.translation.trim()
			};

			loadingSpinner.setLoading();
			setLoading(true);

			if(route.params?.mutateId) {
				let promises = [];

				promises.push(mutatePhrase({
					variables: {
						id: route.params.mutateId,
						input: data
					}
				}));
				
				if(collection !== phraseData.collection) {
					promises.push(movePhrase({
						variables: {
							id: route.params.mutateId,
							destId: collection
						},
						refetchQueries: [{ query: GET_COLLECTION_PHRASES, variables: { id: phraseData.collection } }, { query: GET_COLLECTION_PHRASES, variables: { id: collection }}],
						update: (cache) => {
							cache.modify({
								id: `Collection:${phraseData.collection}`,
								fields: {
									lastUpdate: () => new Date().getTime(),
									//@ts-ignore Meta is not a reference
									meta: (oldMeta: ICollectionMeta) => ({
										...oldMeta,
										phrasesCount: oldMeta.phrasesCount - 1
									})
								}
							});
							cache.modify({
								id: `Collection:${collection}`,
								fields: {
									lastUpdate: () => new Date().getTime(),
									//@ts-ignore Meta is not a reference
									meta: (oldMeta: ICollectionMeta) => ({
										...oldMeta,
										phrasesCount: oldMeta.phrasesCount + 1
									})
								}
							});
						}
					}));
				}
				
				try {
					await Promise.all(promises);
				} catch (e: any) {
					console.log(e);
					errorMessage.setErrorMessage(`Failed to update phrase ${e.toString()}`);
					loadingSpinner.dismissLoading();
					setLoading(false);
					return;
				}
			} else {
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
			}
			
			loadingSpinner.dismissLoading();
			setLoading(false);
			reset();
		}
	})
	
	const [ getSuggestion, { data: suggestionData, loading: suggestionLoading }] = useLazyQuery(GET_TRANSLATED_TEXT);

	useEffect(() => {
		if(settings.settings.disableSuggestions) return;
		
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

		if(route.params?.mutateId) {
			navigation.setParams({ mutateId: undefined });
			navigation.setOptions({
				title: "Add"
			});
		};
	}

	return (
		<View
			style={styles.container}
		>
			{
				phraseLoading &&
				<LoaderModal />
			}
			<ModalWithBody visible={displayModal} onClose={() => setDisplayModal(false)}>
				<EditCollection onReady={() => setDisplayModal(false)} />
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
									{suggestionData?.getTranslatedText}
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
			<SelectDropdown
				data={filteredCollections}
				ref={selectRef as any}
				onSelect={(selectedItem) => formik.setFieldValue("collection", selectedItem.id)}
				buttonTextAfterSelection={(item) => item.name}
				defaultButtonText="Select collection"
				buttonStyle={styles.select}
				buttonTextStyle={styles.selectText}
				renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color="gray" />}
				renderCustomizedRowChild={(item) => {
					if(item.id !== "CREATE") {
						return (
							<View style={styles.selectItem}>
								<Text style={styles.selectItemText}>
									{item.name}
								</Text>
							</View>
						)
					} else {
						return (
							<TouchableOpacity style={styles.selectItem}
								onPress={(e) => {
									e.stopPropagation();
									setDisplayModal(true);
								}}
							>
								<Ionicons name="add" size={28} color="gray" />
							</TouchableOpacity>
						)
					}
				}}

			></SelectDropdown>
			<TouchableOpacity
				onPress={submitHandler}
				style={styles.button}
			>
				<Ionicons name="save" size={24} color="gray" />
			</TouchableOpacity>
		</View>
	)
});

const styles = StyleSheet.create({
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
	inputLabel: {
		fontSize: 18,
		color: fontColor
	},
	inputContainer: {
		position: "relative"	
	},
	input: {
		height: 120,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		borderRadius: 4,
		padding: 7,
		backgroundColor: "white",
		textAlignVertical: "top",
		fontSize: 16,
		lineHeight: 24,
		color: fontColor
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
		flexDirection: "row",
		gap: 5,
		alignItems: "center"
	},
	suggestionInfo: {

	},
	suggestionValue: {

	},
	suggestionValueText: {
		color: "grey",
		textDecorationLine: "underline",
		fontStyle: "italic",
		fontSize: 15
	},
	suggestionTitle: {
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
	},
	select: {
		width: "100%",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "gray",
		marginTop: 15,
		borderRadius: 4,
		height: 45,
		backgroundColor: "#f9f9f9"
	},
	selectText: {
		color: "gray"
	},
	selectItem: {
		flexDirection: "row",
		justifyContent: "center"
	},
	selectItemText: {
		fontSize: 16,
		color: fontColor
	},
	button: {
		position: "absolute",
		bottom: 10,
		right: 10,
		borderRadius: 12,
		backgroundColor: "#f9f9f9",
		width: 45,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "gray",
		borderWidth: 1,
		flexDirection: "row",
		gap: 5
	},
	buttonText: {
		color: "gray",
		fontSize: 18
	}
})

export default Add;