import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";

const AppBar = ({ navigation, showProfileIcon = false, screenName }) => {
  const content = (
    <View style={styles.container}>
      <Pressable style={styles.backButton}>
      <Image
        // source={require("../../assets/Icon.png")}
        
        style={styles.icon}
        
      />
      </Pressable>
     
      <Text style={styles.text}>{screenName}</Text>
    </View>
  );

  const rightSection = showProfileIcon ? (
    <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
      <Image
        source={require("../../assets/profile.svg")}
        style={styles.profileIcon}
      />
    </TouchableOpacity>
  ) : null;

  return (
    <View  style={styles.container}>
    <View style={styles.appNav}>
      {content}
      {rightSection}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    display: "flex",
    flex: "0 0 auto",
    gap: "10",
    position: "relative",
    width: "100%",
    height: "auto",
  },
  appNav: {
    zIndex: 0,
    // width: '100%',
    flex: 1,
    backgroundColor: "#df2929",
   // padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignItems: "center",
    alignSelf: "stretch",
    display: "flex",
  },
  icon: {
    width: 32,
    height: 32,
    backgroundColor: "#FFF",
    margin: 12,
  
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 500,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
});

export default AppBar;
