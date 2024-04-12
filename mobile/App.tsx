import "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/client';
import AuthorizationChecker from "./src/components/AuthorizationChecker";
import { ClickOutsideProvider } from "react-native-click-outside";
import { client } from "src/apollo";
import ErrorMessageToast from "@components/Errors/ToastMessage";
import LoaderToast from "@components/Loaders/LoaderToast";
import { ErrorBoundary } from "react-error-boundary";
import ErrorComponent from "@components/Errors/ErrorComponent";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { useEffect, useState } from "react";
import * as Sentry from '@sentry/react-native';
import { StatusBar } from "expo-status-bar";
import { Platform, useColorScheme } from "react-native";
import * as Notifications from 'expo-notifications';
import Navigation from "src/Navigation";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    //@ts-ignore prop channelId does exist
    if(notification.request.trigger?.channelId === "studyReminder") {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }
    } else {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }
    }

  },
});

Sentry.init({
  dsn: 'https://b2d6cb5760f1c202f6e86948d4378569@o4506399434080256.ingest.sentry.io/4506399492341760',
  debug: true
});

function App() {
  const [ error, setError ] = useState<any>(null);
  const theme = useColorScheme();
	const barColor = theme === "dark" ? "#333" : "#fff";

  useEffect(() => {
    setJSExceptionHandler((error, isFatal) => {
      Sentry.captureException(error);
      if(isFatal) setError(error);
    });
  }, []);

  useEffect(() => {
    if(Platform.OS !== "android") return;

    (async () => {
      const channels = await Notifications.getNotificationChannelsAsync();

      if(!channels || channels.length === 0) {
        await Notifications.setNotificationChannelAsync("statsReminder", {
          name: "Stats reminder",
          importance: Notifications.AndroidImportance.DEFAULT
        });

        await Notifications.setNotificationChannelAsync("phraseOfTheDayReminder", {
          name: "Phrase of the day reminder",
          importance: Notifications.AndroidImportance.DEFAULT
        });

        await Notifications.setNotificationChannelAsync("studyReminder", {
          name: "Study reminder",
          importance: Notifications.AndroidImportance.DEFAULT
        });

        await Notifications.setNotificationChannelAsync("other", {
          name: "Other notifications",
          importance: Notifications.AndroidImportance.DEFAULT
        });
      }
    })();
  }, [])

  if(error) return <ErrorComponent message="Fatal error. Try restarting the app" />

  return (
    <ErrorBoundary fallback={<ErrorComponent message="Fatal error. Try restarting the app" />} onError={(e: any) => Sentry.captureException(e)}>
      <ClickOutsideProvider>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <>
              <ErrorMessageToast />
              <LoaderToast />
              <StatusBar translucent={true} hidden={false} backgroundColor={barColor} />
              <AuthorizationChecker>
                  <Navigation />
              </AuthorizationChecker>
            </>
          </NavigationContainer>
        </ApolloProvider>
      </ClickOutsideProvider>
    </ErrorBoundary>
  );
}

export default App;