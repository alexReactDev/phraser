import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Add from './src/components/Add';
import Collections from './src/components/Collections';
import Settings from "./src/components/Settings";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: "http://192.168.100.13:4500/graphql",
  cache: new InMemoryCache()
});

const Navigator = createBottomTabNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Navigator.Navigator screenOptions={{
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
      </NavigationContainer>
    </ApolloProvider>
  );
}
