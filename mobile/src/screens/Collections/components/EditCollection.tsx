import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import colors from "../../../Colors";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COLLECTION, GET_COLLECTION, GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_FOR_PHRASES, MUTATE_COLLECTION } from "../../../query/collections";
import settings from "../../../store/settings";
import { observer } from "mobx-react-lite";
import errorMessage from "@store/errorMessage";
import loadingSpinner from "@store/loadingSpinner";
import StyledTextInput from "@components/Inputs/StyledTextInput";

interface IProps {
	mutateId?: number,
	onReady?: () => void
}

const EditCollection = observer(function ({ mutateId, onReady }: IProps) {
	const [ name, setName ] = useState("");
	const [ color, setColor ] = useState("");

	const { data } = useQuery(GET_COLLECTION, { variables: { id: mutateId }, skip: !mutateId});
	const [ createCollection ] = useMutation(CREATE_COLLECTION);
	const [ mutateCollection ] = useMutation(MUTATE_COLLECTION);

	const selectRef = useRef<any>({});

	useEffect(() => {
		if(!data) return;

		setName(data.getCollection.name);
		setColor(data.getCollection.color);
		selectRef.current?.selectIndex(colors.findIndex((item) => item.value === data.getCollection.color));
	}, [data])

	async function pressHandler() {
		if(!name || !color) return;

		loadingSpinner.setLoading();

		if(mutateId) {
			try {
				await mutateCollection({
					variables: {
						id: mutateId,
						input: {
							name,
							color
						}
					},
					refetchQueries: [GET_COLLECTION, GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_FOR_PHRASES]
				})
			} catch(e: any) {
				console.log(e);
				errorMessage.setErrorMessage(`Failed to update collection ${e.toString()}`);
			}
		} else {
			try {
				await createCollection({
					variables: {
						input: {
							name,
							color,
							profile: settings.settings.activeProfile
						}
					},
					refetchQueries: [GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_FOR_PHRASES]
				})
			} catch(e: any) {
				console.log(e);
				errorMessage.setErrorMessage(`Failed to create collection ${e.toString()}`);
			}
		}

		onReady && onReady();
		loadingSpinner.dismissLoading();
	}

	return (
		<View style={styles.container}>
			<Text
				style={styles.title}
			>
				{mutateId ? "Edit collection" : "Add collection"}
			</Text>
			<StyledTextInput
				autoFocus
				style={styles.input}
				onChangeText={setName}
				value={name}
				placeholder="Collection name..."
			/>
			<SelectDropdown
				data={colors}
				ref={selectRef as any}
				onSelect={(selectedItem) => setColor(selectedItem.value)}
				buttonStyle={styles.select}
				defaultButtonText="Pick color"
				renderCustomizedButtonChild={(item) => {
					if(!item) return (
						<View
							style={styles.selectActiveItem}
						>
							<Text>Pick color</Text>
						</View>
					)
					return (
						<View
						style={styles.selectItem}
					>
						<View
							style={{
								...styles.selectItemHalf,
								justifyContent: "flex-end",
								paddingRight: 20
							}}
						>
							<View
								style={{
									...styles.selectItemColor,
									backgroundColor: item.value
								}}
							></View>
						</View>
						<View
							style={{
								...styles.selectItemHalf,
								justifyContent: "flex-start"
							}}
						>
							<Text>
								{item.name}
							</Text>
						</View>
					</View>
					)
				}}
				renderCustomizedRowChild={(item) => {
					return (
						<View
							style={styles.selectItem}
						>
							<View
								style={{
									...styles.selectItemHalf,
									justifyContent: "flex-end",
									paddingRight: 20
								}}
							>
								<View
									style={{
										...styles.selectItemColor,
										backgroundColor: item.value
									}}
								></View>
							</View>
							<View
								style={{
									...styles.selectItemHalf,
									justifyContent: "flex-start"
								}}
							>
								<Text>
									{item.name}
								</Text>
							</View>
						</View>
					)
				}}
			></SelectDropdown>
			<View
				style={styles.button}
			>
				<Button
					title={mutateId ? "Edit" : "Add"}
					onPress={pressHandler}
				></Button>
			</View>
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		width: 300,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		padding: 20,
		position: "relative",
		backgroundColor: "white"
	},
	title: {
		fontSize: 18,
		marginBottom: 15
	},
	input: {
		marginBottom: 15
	},
	select: {
		width: "100%",
		marginBottom: 20,
		borderRadius: 2
	},
	selectItem: {
		flexDirection: "row"
	},
	selectItemColor: {
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "gray",
		borderRadius: 50,
		width: 20,
		height: 20
	},
	selectItemHalf: {
		width: "50%",
		flexDirection: "row",
		alignItems: "center"
	},
	selectActiveItem: {
		alignItems: "center"
	},
	button: {
		alignSelf: "center",
		width: "30%"
	}
})

export default EditCollection;