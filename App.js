import { StyleSheet } from 'react-native';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './src/screens/SplashScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ForgotPassword from './src/screens/ForgotPassword';
import PasswordReset from './src/components/PasswordReset';
import BottomNav from './src/components/BottomNav';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
  function MainStack() {
    return (
// Naviagtions have slight animation slies (cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS) from '@react-navigation/stack'; 
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false}} />
        <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false}} />
        <Stack.Screen name='ResetPassword' component={PasswordReset} options={{ headerShown: false , cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS }} />
        <Stack.Screen name='Register' component={RegistrationScreen} options={{ headerShown: false , cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false , cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS }} />
        <Stack.Screen name='About' component={AboutScreen} options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, }} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{title: 'Reset Password', cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}  />
        
      </Stack.Navigator>

    );
  }
  function TabNavigator() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#117000',
          inactiveTintColor: '#6ECC5E',
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









