import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const Button2 = ({ onPress, title, altText }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.btnText}>{title}</Text>
      </TouchableOpacity>
      <View style={styles.divider}></View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "left",
    justifyContent: "flex-start",
  },
  button: {
    // flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 2,
    // borderColor: "black",
    padding: 10,
    width: "100%",
  },
  btnText: {
    alignSelf: "flex-start",
    textAlign: "left",
  },
  divider: {
    width: 10,
  },
  
});

export default Button2;