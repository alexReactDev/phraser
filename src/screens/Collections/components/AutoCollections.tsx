import { useMutation, useQuery } from "@apollo/client";
import { GENERATE_AUTO_COLLECTION, GET_COLLECTION } from "@query/collections";
import CollectionCard from "./CollectionCard";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";
import session from "@store/session";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ICollection } from "types/collections";

type TNavigation = StackNavigationProp<StackNavigatorParams, "Collections", "collectionsNavigator">;

interface IProps {
	navigation: TNavigation,
	onError: (error: any) => void
}

function AutoCollections({ navigation, onError }: IProps) {
	const [ generateAutoCollection ] = useMutation(GENERATE_AUTO_COLLECTION, { variables: { type: "auto" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});
	const [ generateHTMCollection ] = useMutation(GENERATE_AUTO_COLLECTION, { variables: { type: "htm" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});
	const [ generateIntervalCollection ] = useMutation(GENERATE_AUTO_COLLECTION, { variables: { type: "interval" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});

	const [ autoCollectionData, setAutoCollectionData ] = useState<ICollection>();
	const [ HTMCollectionData, setHTMCollectionData ] = useState<ICollection>();
	const [ intervalCollectionData, setIntervalCollectionData  ] = useState<ICollection>();

	useEffect(() => {
		(async () => {
			try {
				const autoCollectionData = await generateAutoCollection();
				setAutoCollectionData(autoCollectionData.data.generateAutoCollection);
			} catch(e) {
				onError(e);
			}
		})();

		(async () => {
			try {
				const HTMCollectionData = await generateHTMCollection();
				setHTMCollectionData(HTMCollectionData.data.generateAutoCollection);
			} catch(e) {
				onError(e);
			}
		})();

		(async () => {
			try {
				const intervalCollectionData = await generateIntervalCollection();
				setIntervalCollectionData(intervalCollectionData.data.generateAutoCollection);
			} catch(e) {
				onError(e);
			}
		})();
	}, []);

//	const { data: autoCollection, error: autoCollectionError } = useQuery(GET_COLLECTION, { variables:  { id: "auto" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});
//	const { data: htmCollection, error: htmCollectionError } = useQuery(GET_COLLECTION, { variables:  { id: "htm" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});
//	const { data: intervalCollection, error: intervalCollectionError } = useQuery(GET_COLLECTION, { variables:  { id: "interval" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});

	/*if(autoCollectionError) onError(autoCollectionError || autoCollection.errors[0]);
	if(htmCollectionError) onError(htmCollectionError || htmCollection.errors[0]);
	if(intervalCollectionError) onError(intervalCollectionError || intervalCollection.errors[0]);*/

	return (
		<>
			{
				autoCollectionData &&
				<CollectionCard collection={autoCollectionData} navigation={navigation} />
			}
						{
				HTMCollectionData &&
				<CollectionCard collection={HTMCollectionData} navigation={navigation} />
			}
						{
				intervalCollectionData &&
				<CollectionCard collection={intervalCollectionData} navigation={navigation} />
			}
		</>
	)
}

export default AutoCollections;