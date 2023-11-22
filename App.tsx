import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Add from './src/screens/Add/Add';
import Collections from './src/screens/Collections/Collections';
import Settings from "./src/screens/Settings/Settings";
import { ApolloProvider } from '@apollo/client';
import AuthorizationChecker from "./src/components/AuthorizationChecker";
import Profiles from "./src/components/Profiles";
import { ClickOutsideProvider } from "react-native-click-outside";
import { client } from "src/apollo";

export type NavigatorParams = {
  Add: { mutateId: number | undefined } | undefined,
  Collections: undefined,
  Settings: undefined
}

const Navigator = createBottomTabNavigator<NavigatorParams>();

export default function App() {
  return (
    <ClickOutsideProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <AuthorizationChecker>
            <Navigator.Navigator 
              id="MainNavigator" 
              screenOptions={{
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                headerRight: () => <Profiles />
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
    </ClickOutsideProvider>
  );
}
