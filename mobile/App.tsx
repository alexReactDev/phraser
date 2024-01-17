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
import ErrorMessageToast from "@components/Errors/ErrorMessageToast";
import LoaderToast from "@components/Loaders/LoaderToast";
import { ErrorBoundary } from "react-error-boundary";
import ErrorComponent from "@components/Errors/ErrorComponent";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { useEffect, useState } from "react";
import * as Sentry from '@sentry/react-native';
import { StatusBar } from "expo-status-bar";

Sentry.init({
  dsn: 'https://b2d6cb5760f1c202f6e86948d4378569@o4506399434080256.ingest.sentry.io/4506399492341760',
  debug: true
});

export type NavigatorParams = {
  Add: { mutateId: number | undefined } | undefined,
  Collections: undefined,
  Settings: undefined
}

const Navigator = createBottomTabNavigator<NavigatorParams>();

function App() {
  const [ error, setError ] = useState<any>(null);

  useEffect(() => {
    setJSExceptionHandler((error, isFatal) => {
      Sentry.captureException(error);
      if(isFatal) setError(error);
    });
  }, []);

  if(error) return <ErrorComponent message="Fatal error. Try restarting the app" />

  return (
    <ErrorBoundary fallback={<ErrorComponent message="Fatal error. Try restarting the app" />} onError={(e: any) => Sentry.captureException(e)}>
      <ClickOutsideProvider>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <AuthorizationChecker>
              <>
                <ErrorMessageToast />
                <LoaderToast />
                <StatusBar translucent={true} hidden={false} />
                <Navigator.Navigator 
                  id="MainNavigator" 
                  screenOptions={{
                    tabBarActiveTintColor: "black",
                    tabBarInactiveTintColor: "gray"
                  }}>
                    <Navigator.Screen name="Add" component={Add} options={{
                      tabBarIcon: ({ focused }) => <Ionicons name="language" size={24} color={focused ? "black" : "gray"} />,
                      headerRight: () => <Profiles />
                    }}></Navigator.Screen>
                    <Navigator.Screen name="Collections" component={Collections} options={{
                      tabBarIcon: ({ focused }) => <Ionicons name="copy" size={24} color={focused ? "black" : "gray"} />,
                      headerShown: false
                    }}></Navigator.Screen>
                    <Navigator.Screen name="Settings" component={Settings} options={{
                      tabBarIcon: ({ focused }) => <Ionicons name="settings-sharp" size={24} color={focused ? "black" : "gray"}  />,
                      headerShown: false
                    }}></Navigator.Screen>
                </Navigator.Navigator>
              </>
            </AuthorizationChecker>
          </NavigationContainer>
        </ApolloProvider>
      </ClickOutsideProvider>
    </ErrorBoundary>
  );
}

export default App;