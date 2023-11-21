import React, { useState } from "react";
<<<<<<< HEAD:src/screens/ForgotPassword.js
import { Image, StyleSheet, Text, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
=======
import {
  Image,
  StyleSheet,
  Text,
  View,
  
} from "react-native";
import { useNavigation } from "@react-navigation/native";
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d:src/screens/ForgotPasswordScreen.js
import Button from "../components/Button";
import InputText from "../components/InputText";
import ShakeFeedback from "../components/ShakeFeedback";
<<<<<<< HEAD:src/screens/ForgotPassword.js
import Button2 from "../components/Button2";

const ForgotPassword = () => {
=======
import { resetPassword } from "../services/authService";

const ForgotPasswordScreen = () => {
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d:src/screens/ForgotPasswordScreen.js
  const [email, setEmail] = useState("");

<<<<<<< HEAD:src/screens/ForgotPassword.js
  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(error.message);
      setLoginAttempts(loginAttempts + 1);

      // Check if login attempts exceed the limit (e.g., 3)
      if (loginAttempts >= 2) {
        // Block the user or perform any other action (e.g., show a message)
        Alert.alert("Login attempts exceeded. Your account is blocked.");
      }
    }
  };

  // Handle Forgot password button click
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
=======
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d:src/screens/ForgotPasswordScreen.js

 
const handleForgotPassword = async () => {  
  try {
    await resetPassword(email);
  } catch (error) {
    
  }
}
  return (
    <View style={styles.container}>
      <View style={styles.formContent}>
        <Image
          source={require("../../assets/Union.png")}
          style={styles.logoImg}
          accessibilityLabel="logo image"
        />
        <ShakeFeedback />
        <Text style={styles.TextButton}>Your safety is just a shake away</Text>
        {/* Staus image */}

        <View style={styles.textContent}>
          {/* HERE IS THE STATUS OF THE SHAKE APP {IN USE OR NOT} */}

          <Text style={styles.boldText}>Shake to Alert</Text>
          <Text style={styles.readyText}>READY</Text>
          {/* <Text style={styles.title}>"Shake to Alert"</Text> */}
        </View>
      </View>

      {/* Reset Password Form Section */}
      <View style={styles.overlay}></View>
      <View style={styles.signupForm}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Reset Password</Text>

          <InputText
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            placeholderTextColor="#f2f2f2"
          />
<<<<<<< HEAD:src/screens/ForgotPassword.js
=======


>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d:src/screens/ForgotPasswordScreen.js
        </View>

        <View style={styles.buttonGroup}>
          <Button
<<<<<<< HEAD:src/screens/ForgotPassword.js
            onPress={() => {
              sendPasswordResetEmail(getAuth(), email);
            }}
            title="submit"
            altText={"submit"}
            color={"#055a2b"}
          />
          {/* <Button2
            onPress={() => {
              console.log("Cancelled Password Reset");
            }}
            title="Cancel"
            altText="Cancel Password Reset"
            textColor={"#ff2323"}
          /> */}
        </View>
      </View>
=======
            onPress={handleForgotPassword}
            title="Reset Password"
            altText={"Reset Password"}
            color={"#055a2b"}
          />
         
        </View>
      </View> 
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d:src/screens/ForgotPasswordScreen.js

      {/* Image at the bottom center */}
      <Image
        source={require("../../assets/undraw.png")}
        style={styles.bottomImage}
      />
    </View>
  );
};

<<<<<<< HEAD:src/screens/ForgotPassword.js
=======
export default ForgotPasswordScreen;
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d:src/screens/ForgotPasswordScreen.js

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 25,
    // paddingHorizontal: 8,
  },
  image: {
    width: 100,
    height: 30,
    marginTop: 10,
  },
  imageVector: {
    width: 100,
    height: 100,
    marginTop: -150,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 20,
    // marginTop: -160,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f2f2f2",
    textAlign: "center",
  },
  readyText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    fontSize: 15,
    width: 55,
    height: 7,
    bottom: 100,
    textAlign: "center",
  },
  signupForm: {
    padding: 30,
    borderRadius: 16,
    backgroundColor: "#002E15",
    alignItems: "flex-start",
    justifyContent: "center",
    // bottom: 210,
    gap: 20,
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    marginHorizontal: 8,
    bottom: 100,
  },
  signupText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  formContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  buttonGroup: {
    width: "100%",
    flexDirection: "column",
    // flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
    marginTop: 12,
  },
  buttonSection: {
    width: "100%",
    height: "auto",
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  input: {
    width: 300,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    bottomBorderColor: "white",
  },
  LoginButton: {
    width: 300,
    height: 42,
    padding: 8,
    paddingHorizontal: 33,
    borderRadius: 40,
    backgroundColor: "#C8FFD7",
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.5,
    textAlign: "center",
    color: "black",
    bottom: -10,
  },
  linksContainer: {
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  TextButton: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    margin: 5,
  },
  bottomImage: {
    zIndex: -1, //sent to back z-index to allow over lay
    width: 200,
    height: 200,
    position: "absolute",
    bottom: 6,
  },
  bottomTab: {
    width: 393,
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingHorizontal: 10,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  greenTabText: {
    color: "green",
    fontWeight: "bold",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tabIcon: {
    width: 10,
    height: 10,
    marginLeft: 5,
  },
  togglePasswordButton: {
    position: "absolute",
    right: 30,
    top: 145,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
  eyeIcon: {
    width: 30,
    height: 30,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.601)",
  },

  // //////////////////////
  textContent: {
    paddingHorizontal: 0,
    wordWrap: "break-word",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    width: "100%",
    gap: 6,
  },
  logoImg: {
    // flex: 1,
    width: 100,
    height: 24,
    marginTop: 24,
    resizeMode: "contain",
    // marginVertical: 20,
  },
  BgImage: {
    width: 180,
    height: 200,
    // marginTop: -140,
    resizeMode: "cover",
    // marginVertical: 20,
  },
});

export default ForgotPassword;
