import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RegistrationScreen from './src/screens/RegistrationScreen';
import AboutScreen from './src/screens/About Screen';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <RegistrationScreen /> */}
      {/* <AboutScreen/> */}
      <SplashScreen/>
      <StatusBar style="auto" />
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
