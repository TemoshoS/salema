import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; //get that nav hook

const BottomNav = ({ supportLabel, helpLabel, aboutLabel }) => {
  const navigation = useNavigation();

  const handleSupportPress = () => {
    navigation.navigate("SupportScreen"); //nav to website
  };

  const handleHelpPress = () => {
    navigation.navigate("HelpScreen"); //Nav to website
  };

  const handleAboutPress = () => {
    navigation.navigate("AboutScreen"); //Nav to aboutScreen
  };

  return (
    // Links
    <View style={styles.bottomNavContainer}>
      <TouchableOpacity style={styles.button} onPress={handleHelpPress}>
        <Text style={styles.navLink}>{helpLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSupportPress}>
        <Text style={styles.navLink}>{supportLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAboutPress}>
        <Text style={styles.navLink}>{aboutLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContainer: {
    height: 52,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-around", //space evenly
    alignItems: "center",
    // backgroundColor: '#3d3d3d',
    width: "100%",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  navLink: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6ECC5E", //our default green
  },
  button: {
    display: "flex",
    paddig: 6,
    // flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default BottomNav;
