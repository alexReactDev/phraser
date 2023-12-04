import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { TouchableOpacity, View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontColor } from "../../styles/variables";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROFILE_COLLECTIONS_FOR_PHRASES } from "../../query/collections";
import SelectDropdown from "react-native-select-dropdown";
import { CREATE_PHRASE, GET_COLLECTION_PHRASES, GET_PHRASE_WITH_COLLECTION, MOVE_PHRASE, MUTATE_PHRASE } from "../../query/phrases";
import { ICollection } from "../../../types/collections";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NavigatorParams } from "../../../App";
import settings from "../../store/settings";
import { observer } from "mobx-react-lite";
import session from "@store/session";

type Props = BottomTabScreenProps<NavigatorParams, "Add", "MainNavigator">;

const Add = observer(function ({ route, navigation }: Props) {
	const { data: { getProfileCollections: collections = [] } = {} } = useQuery(GET_PROFILE_COLLECTIONS_FOR_PHRASES, { variables: { id: settings.settings.activeProfile } });
	const { data: { getPhrase: phraseData, getPhraseCollection: phraseCollection } = {} } = useQuery(GET_PHRASE_WITH_COLLECTION, { variables: { id: route.params?.mutateId }, skip: !route.params?.mutateId });
	const [ createPhrase ] = useMutation(CREATE_PHRASE);
	const [ mutatePhrase ] = useMutation(MUTATE_PHRASE);
	const [ movePhrase ] = useMutation(MOVE_PHRASE);
	const selectRef = useRef<any>({});

	useEffect(() => {
		if(phraseData && phraseCollection) {
			formik.setFieldValue("value", phraseData.value);
			formik.setFieldValue("translation", phraseData.translation);
			formik.setFieldValue("collection", phraseCollection.id);
			selectRef.current?.selectIndex(collections.findIndex((col: ICollection) => col.id == phraseCollection.id))
		}
	}, [phraseData]);

	const formik = useFormik({
		initialValues: {
			value: "",
			translation: "",
			collection: null
		},
		onSubmit(values) {
			const { collection, ...data } = values;

			if(route.params?.mutateId) {
				mutatePhrase({
					variables: {
						id: route.params.mutateId,
						input: data
					},
					refetchQueries: [{ query: GET_COLLECTION_PHRASES, variables: { id: phraseCollection.id } }]
				});

				if(collection !== phraseCollection.id) {
					movePhrase({
						variables: {
							id: route.params.mutateId,
							destId: collection
						},
						refetchQueries: [{ query: GET_COLLECTION_PHRASES, variables: { id: phraseCollection.id } }, { query: GET_COLLECTION_PHRASES, variables: { id: collection }}]
					})
				}
			} else {
				createPhrase({
					variables: {
						input: data,
						collection
					},
					context: {
						headers: {
							"Authorization": `Bearer ${session.data.token}`
						}
					},
					refetchQueries: [{ query: GET_COLLECTION_PHRASES, variables: { id: collection } }]
				})
			}

			formik.resetForm();
			selectRef.current?.reset();

			if(route.params?.mutateId) navigation.setParams({ mutateId: undefined });
		}
	})

	return (
		<View
			style={styles.container}
		>
			<TextInput
				onChangeText={formik.handleChange("value")}
				onBlur={formik.handleBlur("value")}
				value={formik.values.value}
				multiline={true}
				style={styles.input}
				placeholder="Enter phrase..."
			/>
			<Ionicons name="arrow-down" size={24} color="gray" style={styles.icon} />
			<TextInput
				onChangeText={formik.handleChange("translation")}
				onBlur={formik.handleBlur("translation")}
				value={formik.values.translation}
				multiline={true}
				style={styles.input}
				placeholder="Enter translation..."
			/>
			<SelectDropdown
				data={collections.filter((col: ICollection) => !col.isLocked)}
				ref={selectRef as any}
				onSelect={(selectedItem) => formik.setFieldValue("collection", selectedItem.id)}
				rowTextForSelection={(item) => item.name}
				buttonTextAfterSelection={(item) => item.name}
				defaultButtonText="Select collection"
				buttonStyle={styles.select}
				buttonTextStyle={styles.selectText}
				renderDropdownIcon={() => <Ionicons name="caret-down" size={20} color="gray" />}

			></SelectDropdown>
			<TouchableOpacity
				onPress={() => formik.handleSubmit()}
				style={styles.button}
			>
				<Ionicons name="save" size={24} color="gray" />
			</TouchableOpacity>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		padding: 10,
		position: "relative",
		height: "100%"
	},
	input: {
		height: 150,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		borderRadius: 2,
		padding: 7,
		backgroundColor: "white",
		textAlignVertical: "top",
		fontSize: 16,
		lineHeight: 24,
		color: fontColor
	},
	icon: {
		marginVertical: 10,
		alignSelf: "center"
	},
	select: {
		width: "100%",
		borderStyle: "solid",
		borderWidth: 1,
		borderColor: "gray",
		marginTop: 15,
		borderRadius: 2
	},
	selectText: {
		color: "gray"
	},
	button: {
		position: "absolute",
		bottom: 10,
		right: 10,
		borderRadius: 50,
		backgroundColor: "white",
		width: 45,
		height: 45,
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: "gray",
		borderWidth: 1
	}
})

export default Add;