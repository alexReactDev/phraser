import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from "@apollo/client";
import { CHANGE_COLLECTION_LOCK, DELETE_COLLECTION, GET_COLLECTION, GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_NAMEID } from "../query/collections";
import EditCollection from "./EditCollection";

function CollectionHeaderButtons({ route, navigation }: any) {
	const colId = route.params.colId;
	const { data, refetch } = useQuery(GET_COLLECTION, { variables: { id: colId } });
	const [ displayModal, setDisplayModal ] = useState(false);
	const [ deleteCollection ] = useMutation(DELETE_COLLECTION);
	const [ changeCollectionLock ] = useMutation(CHANGE_COLLECTION_LOCK);

	useEffect(() => {
		if(!data) return;

		navigation.setOptions({
			headerStyle: {
				backgroundColor: data.getCollection.color
			},
			headerTintColor: "white"
		})
	}, [data])

	if(!data) return null;

	function deleteHandler() {
		Alert.alert(`Delete collection ${data.getCollection.name}?`, "", [
			{
				text: "Cancel",
				style: "cancel"
			},
			{
				text: "Delete",
				onPress: () => {
					deleteCollection({
						variables: { id: colId },
						refetchQueries: [GET_PROFILE_COLLECTIONS, GET_PROFILE_COLLECTIONS_NAMEID]
					});
					navigation.navigate("Collections");
				}
			}
		])
	}

	function setLockHandler() {
		changeCollectionLock({
			variables: { 
				id: colId,
				input: {
					isLocked: !data.getCollection.isLocked
				}
			}
		})
		refetch();
	}

	return (
		<View style={styles.container}>
			<Modal
				visible={displayModal}
				transparent={true}
				animationType="slide"
			>
				<View
					style={styles.modalContainer}
				>
					<View
						style={styles.modal}
					>
						<TouchableOpacity
							onPress={() => setDisplayModal(false)}
							style={styles.modalBtn}
						>
							<Ionicons name="close" color="gray" size={24} />
						</TouchableOpacity>
						<EditCollection mutateId={data.getCollection.id} onReady={() => setDisplayModal(false)} />
					</View>
				</View>
			</Modal>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => navigation.navigate("Learn", { colId })}
				style={{marginTop: 5, marginRight: 4}}
			>
				<Ionicons name="book" size={24} color="#eee" />
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={setLockHandler}
			>
				<Ionicons name={data.getCollection.isLocked ? "lock-closed" : "lock-open"} size={24} color="#eee" />
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={() => setDisplayModal(true)}
			>
				<Ionicons name="pencil" size={24} color="#eee" />
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={deleteHandler}
			>
				<Ionicons name="trash-outline" size={24} color="#eee" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 15,
		paddingHorizontal: 15,
		alignItems: "center"
	},
	modalContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff88"
	},
	modal: {
		width: 300,
		borderWidth: 1,
		borderColor: "gray",
		borderStyle: "solid",
		padding: 20,
		position: "relative",
		backgroundColor: "white"
	},
	modalBtn: {
		position: "absolute",
		top: 5,
		right: 5
	}
})

export default CollectionHeaderButtons;