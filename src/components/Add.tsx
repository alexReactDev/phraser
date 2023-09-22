import { useFormik } from "formik";
import { TouchableOpacity, View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { fontColor } from "../styles/variables";
import { useMutation, useQuery } from "@apollo/client";
import { GET_COLLECTIONS_NAMEID_ALL } from "../query/collections";
import SelectDropdown from "react-native-select-dropdown";
import { CREATE_PHRASE, GET_COLLECTION_PHRASES, MUTATE_PHRASE } from "../query/phrases";

function Add({ route }: any) {
	const { data: { getCollections: collections = [] } = {} } = useQuery(GET_COLLECTIONS_NAMEID_ALL);
	const [ createPhrase ] = useMutation(CREATE_PHRASE);
	const [ mutatePhrase ] = useMutation(MUTATE_PHRASE);

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
						input: data,
						collection
					},
					refetchQueries: [GET_COLLECTION_PHRASES]
				});
			} else {
				createPhrase({
					variables: {
						input: data,
						collection
					},
					refetchQueries: [GET_COLLECTION_PHRASES]
				})
			}
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
				data={collections}
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
}

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