import { StyleSheet, TouchableOpacity ,Image} from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import AboutScreen from './src/screens/AboutScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './src/screens/ProfileScreen';
import LandingScreen from './src/screens/LandingScreen';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


export default function App() {
    
    return (
         <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>
         <Stack.Navigator initialRouteName='LandingPage'>
      
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
    width: 108,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
}
});

