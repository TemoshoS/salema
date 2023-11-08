import { StyleSheet } from 'react-native';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './src/screens/SplashScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  function MainStack() {
    return (

      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name='About' component={AboutScreen} options={{ headerShown: false }} />
      </Stack.Navigator>

    );
  }
  function TabNavigator() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#808080',
          inactiveTintColor: '#AFEEEE',
        }}
      >
        <Tab.Screen
          name="Splash"
          component={MainStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="home"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Help"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="help-circle"
                color={color}
                size={size}
              />
            ),
          }} />
        <Tab.Screen
          name="About Us"
          component={AboutScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="information-outline"
                color={color}
                size={size}
              />
            ),
          }} />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
});









