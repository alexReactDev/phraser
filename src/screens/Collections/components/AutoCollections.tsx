import { useQuery } from "@apollo/client";
import { GET_COLLECTION } from "@query/collections";
import CollectionCard from "./CollectionCard";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "../Collections";
import session from "@store/session";

type TNavigation = StackNavigationProp<StackNavigatorParams, "Collections", "collectionsNavigator">;

interface IProps {
	navigation: TNavigation,
	onError: (error: any) => void
}

function AutoCollections({ navigation, onError }: IProps) {
	const { data: autoCollection, error: autoCollectionError } = useQuery(GET_COLLECTION, { variables:  { id: "auto" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});
	const { data: htmCollection, error: htmCollectionError } = useQuery(GET_COLLECTION, { variables:  { id: "htm" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});
	const { data: intervalCollection, error: intervalCollectionError } = useQuery(GET_COLLECTION, { variables:  { id: "interval" }, context: { headers: { "Authorization": `Bearer ${session.data.token}` } }});

	if(autoCollectionError) onError(autoCollectionError || autoCollection.errors[0]);
	if(htmCollectionError) onError(htmCollectionError || htmCollection.errors[0]);
	if(intervalCollectionError) onError(intervalCollectionError || intervalCollection.errors[0]);

	return (
		<>
			{
				autoCollection?.getCollection &&
				<CollectionCard collection={autoCollection.getCollection} navigation={navigation} />
			}
						{
				htmCollection?.getCollection &&
				<CollectionCard collection={htmCollection.getCollection} navigation={navigation} />
			}
						{
				intervalCollection?.getCollection &&
				<CollectionCard collection={intervalCollection.getCollection} navigation={navigation} />
			}
		</>
	)
}

export default AutoCollections;