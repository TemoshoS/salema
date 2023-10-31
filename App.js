import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
// Navigation Contents
import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
// Nv Screens
import HomeScreen from "./src/screens/HomeScreen";
import AboutScreen from "./src/screens/About Screen";
// Components
import Navbar from "./src/components/Navbar"; //import nav hook
import BottomNav from "./src/components/BottomNav";
import TextField from "./src/components/TextField";
import Card from "./src/components/Card";

const Stack = createStackNavigator(); //nav container

export default function App() {
  // testing components
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleRegistration = () => {
    // Handle registration logi
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="SupportScreen" component={SupportScreen} /> */}
          {/* <Stack.Screen name="HelpScreen" component={HelpScreen} /> */}
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>

        {/* Testing components */}
        <Navbar />
        <View>
        <Card
        title="Your Personal Safety Companion"
        // title2="Title 2"       
        content="Salema is more than just an app - it's your lifeline when you need it most. Designed with your safety in mind, Salema allows you to quickly and discreetly send emergency SMS alerts to your trusted contacts with a simple shake of your phone."
        // image={require('./path/to/image.jpg')}
      />
      <TextField
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextField
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
        </View>
        <BottomNav helpLabel="Help" supportLabel="Support" aboutLabel="About" />
      </NavigationContainer>
    </View>
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
