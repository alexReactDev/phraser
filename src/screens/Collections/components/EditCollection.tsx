import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import colors from "../../../Colors";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_COLLECTION, GET_COLLECTION, GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_NAMEID, MUTATE_COLLECTION } from "../../../query/collections";
import settings from "../../../store/settings";
import { observer } from "mobx-react-lite";

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

	function pressHandler() {
		if(mutateId) {
			mutateCollection({
				variables: {
					id: mutateId,
					input: {
						name,
						color,
						profile: settings.settings.activeProfile
					}
				},
				refetchQueries: [GET_COLLECTION, GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_NAMEID]
			})
		} else {
			if(!name || !color) return;

			createCollection({
				variables: {
					input: {
						name,
						color,
						profile: settings.settings.activeProfile
					}
				},
				refetchQueries: [GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_NAMEID]
			})
		}

		onReady && onReady();
	}

	return (
		<View>
			<Text
				style={styles.title}
			>
				{mutateId ? "Edit collection" : "Add collection"}
			</Text>
			<TextInput
				style={styles.input}
				onChangeText={setName}
				value={name}
				placeholder="Collection name..."
			></TextInput>
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
	title: {
		fontSize: 18,
		marginBottom: 15
	},
	input: {
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		borderRadius: 2,
		paddingVertical: 5,
		paddingHorizontal: 10,
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