import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Add from './src/components/Add';
import Collections from './src/components/Collections';
import Settings from "./src/components/Settings";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import AuthorizationChecker from "./src/components/AuthorizationChecker";

const client = new ApolloClient({
  uri: "http://192.168.100.7:4500/graphql",
  cache: new InMemoryCache()
});

export type NavigatorParams = {
  Add: { mutateId: number | undefined } | undefined,
  Collections: undefined,
  Settings: undefined
}

const Navigator = createBottomTabNavigator<NavigatorParams>();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <AuthorizationChecker>
          <Navigator.Navigator id="MainNavigator" screenOptions={{
              tabBarActiveTintColor: "black",
              tabBarInactiveTintColor: "gray"
            }}>
              <Navigator.Screen name="Add" component={Add} options={{
                tabBarIcon: ({ focused }) => <Ionicons name="language" size={24} color={focused ? "black" : "gray"} />
              }}></Navigator.Screen>
              <Navigator.Screen name="Collections" component={Collections} options={{
                tabBarIcon: ({ focused }) => <Ionicons name="copy" size={24} color={focused ? "black" : "gray"} />,
                headerShown: false
              }}></Navigator.Screen>
              <Navigator.Screen name="Settings" component={Settings} options={{
                tabBarIcon: ({ focused }) => <Ionicons name="settings-sharp" size={24} color={focused ? "black" : "gray"}  />
              }}></Navigator.Screen>
          </Navigator.Navigator>
        </AuthorizationChecker>
      </NavigationContainer>
    </ApolloProvider>
  );
}
