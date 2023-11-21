import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const Button2 = ({ onPress, title, altText, textColor }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
      </TouchableOpacity>
      <View style={styles.divider}></View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 350,
  },
  button: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: .08,
    borderColor: "#00de644e",
    padding: 10,
    width: 360,
    textAlign: "left",
  },
  btnText: {
    alignSelf: "flex-start",
    
    alignSelf: "left",
    // color: "#f2f2f2",
  },
  divider: {
    // width: "90%",
    height: 0.8,
    // borderBottomWidth: .08,
  },
  
});

export default Button2;