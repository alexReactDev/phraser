import "react-native-gesture-handler";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Add from './screens/Add/Add';
import Collections from './screens/Collections/Collections';
import Settings from "./screens/Settings/Settings";
import Profiles from "./components/Profiles";
import Stats from "src/screens/Stats/Stats";
import { createStackNavigator } from "@react-navigation/stack";
import Premium from "./screens/Premium/Premium";
import Plans from "./screens/Premium/Plans/Plans";
import Wallpaper from "@components/Wallpaper";


export type NavigatorParams = {
	Add: undefined,
	Collections: undefined,
	Stats: undefined,
	Settings: undefined
}

export type PremiumNavigatorParams = {
	App: undefined,
	Premium: undefined,
	Plans: undefined
}

const Navigator = createBottomTabNavigator<NavigatorParams>();
const PremiumNavigator = createStackNavigator<PremiumNavigatorParams>();

function Navigation() {
	return (
		<PremiumNavigator.Navigator id="premiumNavigator">
			<PremiumNavigator.Screen name="App" component={AppNavigation} options={{ headerShown: false }} />
			<PremiumNavigator.Screen name="Premium" component={Premium} />
			<PremiumNavigator.Screen name="Plans" component={Plans} />
		</PremiumNavigator.Navigator>
	)
}

function AppNavigation() {
	return (
		<Wallpaper>
			<Navigator.Navigator 
				id="MainNavigator" 
				screenOptions={{
					tabBarActiveTintColor: "black",
					tabBarInactiveTintColor: "#888",
					tabBarStyle: {
						height: 55,
						paddingBottom: 4,
						paddingTop: 5
					},
					tabBarLabelStyle: {
						fontSize: 11
					},
					headerTitleStyle: {
						fontSize: 17
					}
				}}
			>
				<Navigator.Screen 
					name="Add" 
					component={Add} 
					options={{
					tabBarIcon: ({ focused }) => <Ionicons name="language" size={24} color={focused ? "black" : "#888"} />,
					headerRight: () => <Profiles />
					}}
				></Navigator.Screen>
				<Navigator.Screen 
					name="Collections" 
					component={Collections} 
					options={{
					tabBarIcon: ({ focused }) => <Ionicons name="copy" size={24} color={focused ? "black" : "#888"} />,
					headerShown: false
					}}
				></Navigator.Screen>
				<Navigator.Screen 
					name="Stats" 
					component={Stats} 
					options={{
					tabBarIcon: ({ focused }) => <Ionicons name="stats-chart" size={24} color={focused ? "black" : "#888"}  />,
					headerRight: () => <Profiles />
					}}
				></Navigator.Screen>
				<Navigator.Screen 
					name="Settings" 
					component={Settings} 
					options={{
					tabBarIcon: ({ focused }) => <Ionicons name="settings-sharp" size={24} color={focused ? "black" : "#888"}  />,
					headerShown: false
					}}
				></Navigator.Screen>
			</Navigator.Navigator>
		</Wallpaper>
	);
}

export default Navigation;