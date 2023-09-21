import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_COLLECTION, GET_COLLECTION, GET_COLLECTIONS_ALL, MUTATE_COLLECTION } from "../query/collections";

function CollectionHeaderButtons({ route, navigation }: any) {
	const colId = route.params.colId;
	const { data, refetch } = useQuery(GET_COLLECTION, { variables: { id: colId } });
	const [ deleteCollection ] = useMutation(DELETE_COLLECTION);
	const [ mutateCollection ] = useMutation(MUTATE_COLLECTION);

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
						refetchQueries: [GET_COLLECTIONS_ALL]
					});
					navigation.navigate("Collections");
				}
			}
		])
	}

	console.log(data.getCollection.isLocked);

	function setLockHandler() {
		mutateCollection({
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
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={setLockHandler}
			>
				<Ionicons name={data.getCollection.isLocked ? "lock-closed" : "lock-open"} size={24} color="gray" />
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
			>
				<Ionicons name="pencil" size={24} color="gray" />
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
				onPress={deleteHandler}
			>
				<Ionicons name="trash-outline" size={24} color="gray" />
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.5}
			>
				<View style={{...styles.color, backgroundColor: data.getCollection.color}} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 15,
		paddingHorizontal: 15
	},
	color: {
		borderWidth: 1,
		borderColor: "gray",
		width: 23,
		height: 23,
		borderRadius: 50
	}
})

export default CollectionHeaderButtons;