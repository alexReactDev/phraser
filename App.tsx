import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Add from './src/components/Add';

const Navigator = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Navigator.Navigator screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray"
      }}>
        <Navigator.Screen name="Add" component={Add} options={{
          tabBarIcon: ({ focused }) => <Ionicons name="language" size={24} color={focused ? "black" : "gray"} />
        }}></Navigator.Screen>
        <Navigator.Screen name="Collections" component={Add} options={{
          tabBarIcon: ({ focused }) => <Ionicons name="copy" size={24} color={focused ? "black" : "gray"} />
        }}></Navigator.Screen>
        <Navigator.Screen name="Settings" component={Add} options={{
          tabBarIcon: ({ focused }) => <Ionicons name="settings-sharp" size={24} color={focused ? "black" : "gray"}  />
        }}></Navigator.Screen>
      </Navigator.Navigator>
    </NavigationContainer>
  );
}
