import { StyleSheet, TouchableOpacity ,Image} from 'react-native';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfileScreen from './src/screens/ProfileScreen';
import LandingScreen from './src/screens/LandingScreen';

import HeaderProfileButton from './src/components/headerProfileButton';
import Button from './src/components/Button';
// import PasswordReset from './src/components/PasswordReset';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
    
    return (
         <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>
         <Stack.Navigator initialRouteName='LandingPage'>
      {/* Welcome is the new Splash SCreen */}
      
      <Stack.Screen name='About' component={AboutScreen} options={{ title: 'About', headerShown: true, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, }} />
       <Stack.Screen 
       name='LandingPage' 
       component={LandingScreen} 
       options={({route, navigation}) => ({ // get reference to navigation
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,  
        headerShadowVisible: false,
          headerTitle:"",
          headerStyle: { backgroundColor: '#ffffff' },
        headerRight :() =>(
          <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate("ProfileScreen")}
        >
          <Image
            source={require("./assets/profile.png")}
            style={styles.profileicon}
          />
        </TouchableOpacity>
        )
       })}
     
       />
       
       <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ title:"My Account"
       }} />
    
       <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false , cardStyleInterpolator:CardStyleInterpolators.forHorizontalIOS,  presentation: 'modal', }} />

       {/* Screens below Must be scrapped */}
       <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false}} />
       <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false}} />
       </Stack.Navigator>
       {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
       <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
     
      </GestureHandlerRootView>

    );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar:{
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
}
});

