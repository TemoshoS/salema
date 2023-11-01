import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
// Navigation Contents
import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

// Components
import ComponentsTest from "./src/components/componentsTest";     //file used to test components


export default function App() {

  return (
    <View style={styles.container}>
     <ComponentsTest/>
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
