import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

const AppBar = ({ navigation, showProfileIcon = false, screenName }) => {
  const content = (
    <View style={styles.content}>
      <Image
        source={require("../../assets/Arrow_Left.png")}
        style={styles.icon}
      />
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
    // width: '100%',
    flex: 1,
    backgroundColor: "#df2929",
    // padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },
  content: {
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
