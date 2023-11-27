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
import ProfileScreen from './src/screens/ProfileScreen';
import LandingScreen from './src/screens/LandingScreen';
import BottomNav from './src/components/BottomNav';
import NotificationService from './src/services/ShakeTrigger';
import { useEffect } from 'react';
import WelcomeScreen from './src/screens/WelcomeScreen';
// import PasswordReset from './src/components/PasswordReset';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
    
    return (
      <NavigationContainer>
         <Stack.Navigator initialRouteName='Home'>
      {/* Welcome is the new Splash SCreen */}
      <Stack.Screen name='Welcome' component={WelcomeScreen} options={{ headerShown: false}} />
      <Stack.Screen name='About' component={AboutScreen} options={{ title: 'About', headerShown: true, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, }} />
      {/* Landing Page is the new HomePage */}
       <Stack.Screen name='LandingPage' component={LandingScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false}} />
       <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ title:"My Account", headerShown: true
       }} />


       {/* Screens below Must be scrapped */}
       <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false}} />
       <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false}} />
        {/* <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false}} />
        <Stack.Screen name='Register' component={RegistrationScreen} options={{ headerShown: false , cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false , cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS }} />
        
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{title: 'Reset Password', cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}} /> */}
        
       </Stack.Navigator>
      </NavigationContainer>
     
        
    );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 8,
  },
});

