import React, { useState } from "react";
import {  StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Button from "../components/Button";
// input InputText || Component
import InputText from "../components/InputText";
import { loginUser } from "../services/authService";
import SignupModal from "../components/SignupModal";
import ForgotPassModal from "../components/ForgotPassModal";
import LoginModal from "../components/LoginModal";


const LoginScreen = ({onRegister, onLogin, onForgotPass,closeModal}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassModalVisible, setForgotPassModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const[isLoginModalVisible, setLoginModalVisible] = useState(false);
  // import {onCloseModal} from "../components/LoginModal";

  const handleLogin = async () => {
  
    try {
     const user = await loginUser(email, password);
      // props.closeModal
      closeModal()
      console.log("login method callled");
      // navigation.s('LandingPage');
      // Terminate modal
    } catch (error) {
      Alert.alert(error.message);
      console.log(error);
      setLoginAttempts(loginAttempts + 1);

      // Check if login attempts exceed the limit (e.g., 3)
      if (loginAttempts >= 2) {
        // Block the user or perform any other action (e.g., show a message)
        Alert.alert('Login attempts exceeded. Your account is   locked.');
    }
  }
  };

  // FUNCTION are now suffixed SHOWfUNTIONnAME
const handleRegister = () => {
  // navigation.navigate("Register");
  setRegisterModalVisible(true);
}
  // Handle Forgot password button click
  const handleForgotPassword = () => {
    // navigation.navigate("ForgotPassword");
    setForgotPassModalVisible(true);
  }


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const closeModal = () => {
  //   console.log("closed modal on splash")
  //   setLoginModalVisible(false);
  //   setForgotPassModalVisible(false)
  // };

  return (
    <View style={styles.container}>
      {/* Signup Form */}
      <View style={styles.signupForm}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Login</Text>
          

          <InputText
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="username@123.com"
            placeholderTextColor="#f2f2f2"
            label={"Email"}
          />

          <InputText
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            placeholder="password"
            secureTextEntry={true} // Hide the password with stars
            placeholderTextColor="#f2f2f2"
            label={"Password"}
          />
        </View>

        <View style={styles.buttonGroup}>
          <Button
            onPress={() => handleLogin()}
            title="Login"
            altText={"Login"}
            color={"#055a2b"}
          />
        </View>

        <View style={styles.linksContainer}>
        {/* NAVIGATION LINKS */}
         <TouchableOpacity style={styles.button} onPress={onForgotPass}>
          <Text style={{ color: "#FFF" }}>Forgot password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onRegister}>
        <Text style={{ color: "#FFF" }}>Register</Text>
        </TouchableOpacity>
        </View>
      </View>
      

    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
    // padding: 30,
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
    // bottom: 100,
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
  input: {
    width: 100,
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
    zIndex: -1,   //sent to back z-index to allow over lay
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
    display: "flex",
    flex: 1,
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
