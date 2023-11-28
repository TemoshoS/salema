import React, { useState } from "react";
import {  StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";
import Spinner from "react-native-loading-spinner-overlay";
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
import { initializeAuth } from "firebase/auth";


const LoginScreen = ({onRegister, onLogin, onForgotPass,closeModal,openRegister}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassModalVisible, setForgotPassModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const[isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const navigation = useNavigation();
  // import {onCloseModal} from "../components/LoginModal";

  const handleLogin = async () => {
  
    try {
      setIsLoaderVisible(true)
     const user = await loginUser(email, password);
     if(user){
      closeModal();
      navigation.navigate('LandingPage');
      
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        visibilityTime: 4000,
      })
     }
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

  
  // Handle Forgot password button click
  const handleForgotPassword = () => {
    onForgotPass()
  }


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {/* Signup Form */}
      <View style={styles.loginForm}>
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

        <TouchableOpacity style={styles.LoginButton} onPress={() => handleLogin()}>
          <Text>Login</Text>
          {isLoaderVisible && <Spinner size='small' color="#fff" style={styles.spinner}/>}
        </TouchableOpacity>

        <View style={styles.linksContainer}>
        {/* NAVIGATION LINKS */}
         <TouchableOpacity style={styles.button} onPress={() => handleForgotPassword()}>
          <Text style={{ color: "#FFF" }}>Forgot password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => openRegister()}>
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
    alignContent:"center",
    paddingHorizontal: 8,
    padding:10,
  
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop:10,
    color: "#f2f2f2",
    textAlign: "center",
  },
  readyText: {
    fontWeight: "400",
    fontSize: 15,
    width: 55,
    height: 7,
    bottom: 100,
    textAlign: "center",
  },
  loginForm: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#002E15",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    marginHorizontal: 8,
  },

  formContent: {
    alignItems: "center",
    gap: 20,
    padding:6,
    justifyContent: 'center',
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
    borderRadius: 40,
    backgroundColor: "#C8FFD7",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.5,
    alignItems:"center",
    justifyContent:'center'
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
  spinner:{
    position: "absolute",
    right: 16,
  }
 
});
