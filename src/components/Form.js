import React from "react";
import { View, StyleSheet } from "react-native";

const Form = () => {

  return(
    <View style={styles.formContainer}>
    
    <TextField
      label="Email"
      placeholder="Enter your email"
    />
    <TextField
      label="Password"
      placeholder="Enter your password"
    />
    <TextField
      label="Confirm Password"
      placeholder="Confirm your password"
    />


    </View>
  ); 
};

const styles = StyleSheet.create({
    // This will contain the form contents (inputs and buttons)
  formContainer: {
    display: "flex",
    // padding: "30px 20px 20px 20px",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 20,
    alignSelf: "stretch",
    borderRadius:20,
    backgroundColor:"#002E15",
  },
//   This will be the background overlay of the screen
  overlay: {
    display: "flex",
    position: "absolute",
    width: 395,
    height: 850,
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#0e0e0e69",
  }
});

export default Form;
