import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
   <LoginScreen/>
  //  <NavigationContainer>
    //  <Stack.Navigator initialRouteName='Register'>
     //   <Stack.Screen name='Welcome' component={HomeScreen} options={{ headerShown: false }} />
     //   <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
     //   <Stack.Screen name='Register' component={RegistrationScreen} options={{ headerShown: false }} />
     // </Stack.Navigator>
   // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
