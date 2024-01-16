import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { auth } from "../services/firebaseService";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Union from "../../assets/Union.png";
import Vector from "../../assets/Vector.png";
import InputText from "../components/InputText";
import Button from "../components/Button";

import Toast from "react-native-toast-message";


const RegistrationScreen = ({onLogin, onRegister,closeModal}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneNumberError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [reenterPasswordError, setReenterPasswordError] = useState(null);
  const [userExistsMessage, setUserExistsMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const navigation = useNavigation();

  const handlePasswordChange = (text, isConfirmPassword = false) => {
    if (!isConfirmPassword) {
      // Handle changes for the "Password" field
      setPassword(text);

      // Password strength validation
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
      if (!text.match(passwordRegex)) {
        setPasswordError(
          "Password must contain at least 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character"
        );
      } else {
        setPasswordError(null); // Clear the error message when the password is valid.
      }
    } else {
      // Handle changes for the "Confirm Password" field
      setReenterPassword(text);

      // Check if the Confirm Password field matches the Password field
      if (text !== password) {
        setReenterPasswordError("Passwords do not match");
      } else {
        setReenterPasswordError(null);
      }
    }
  };

  const handleRegister = async () => {
   
  
   
  
  
    
  
    try {
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
  
      
      await updateProfile(userCredential.user, { displayName: name });
  
      
      setUserExistsMessage('Account created successfully!');
      setIsConfirmationVisible(true);
  
    } catch (error) {
      // Handle registration errors
      if (error.code === 'auth/email-already-in-use') {
        setUserExistsMessage('Email address is already in use.');
      } else {
        setUserExistsMessage('Error creating account. Please try again.');
      }
    }
  };
  
  
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const hideConfirmation = () => {
    navigation.navigate("Login");
    setIsConfirmationVisible(false);
  };


  return (
    <View style={styles.container}>
      {/* Signup Form */}
 <TouchableOpacity style={styles.closeIcon} onPress={() => closeModal()}>
        <Ionicons name="ios-close" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.signupForm}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Signup</Text>
          <View>
            <InputText
              style={styles.input}
              placeholder="name & surname"
              placeholderTextColor="white"
              onChangeText={(text) => setName(text)}
              label={"Full Name"}
            />
            {nameError && <Text style={styles.errorText}>{nameError}</Text>}
          </View>
          <View>
            <InputText
              style={styles.input}
              placeholder="username@123.com"
              placeholderTextColor="white"
              onChangeText={(text) => setEmail(text)}
              label={"Email"}
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>
          <View>
            <InputText
              style={styles.input}
              placeholder="0123456789"
              placeholderTextColor="white"
              onChangeText={(text) => setPhoneNumber(text)}
              label={"Number"}
            />
            {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
          </View>

          <View>
            <View style={styles.TextInputGroup}>
              <TouchableOpacity
                style={styles.floatIcon}
                onPress={toggleShowPassword}
                accessibilityLabel="show password"
              ></TouchableOpacity>
              <InputText
                style={styles.input}
                placeholder="username@123.com"
                onChangeText={(text) => handlePasswordChange(text)}
                secureTextEntry={!showPassword}
                label={"Password"}
              />
              <Feather
                accessibilityLabel="show password"
                name={showPassword ? "eye-off" : "eye"}
                size={19}
                color="white"
                style={styles.icon}
              />
              
            </View>
            {/* WARNING TEXT */}
            {passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
          </View>
          <View>
            <InputText
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={(text) => handlePasswordChange(text, true)} // Pass true to indicate it's the Confirm Password field
              secureTextEntry={!showPassword}
              label={"Confirm Password"}
            />
            {reenterPasswordError && (
              <Text style={styles.errorText}>{reenterPasswordError}</Text>
            )}
          </View>

          {userExistsMessage && (
            <Text style={styles.successMessage}>{userExistsMessage}</Text>
          )}

          <View style={styles.passwordStrength}>
            {passwordStrength && (
              <Text>Password Strength: {passwordStrength}</Text>
            )}
          </View>

          
          <TouchableOpacity onPress={() => handleRegister()} style={styles.registerButton}>
              <Text>CREATE ACCOUNT</Text>
          </TouchableOpacity>

          <View style={styles.loginNav}>
            <Text style={styles.loginNav}>Already have an account?</Text>
            <TouchableOpacity onPress={onLogin}>
              <Text style={styles.loginTxt}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding:10
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
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#002E15",
    alignItems: "flex-start",
    justifyContent: "center",
    // bottom: 210,
    gap: 20,
    color: "white",
    display: "flex",
    flexDirection: "column",
    // marginHorizontal: 8,
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
    // marginTop: 12,
  },
  TextInputGroup: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
  },
  input: {
    width: 100,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    bottomBorderColor: "white",
  },
  registerButton: {
    width: 300,
    height: 42,
    padding: 8,
    paddingHorizontal: 33,
    borderRadius: 40,
    backgroundColor: "#C8FFD7",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.5,
    justifyContent:'center',
    alignItems:"center"
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
  loginNav: {
    flexDirection: "row",
    color: "#f2f2f2",
    gap: 16,
  },
  loginTxt: {
    color: "#C8FFD7",
    textDecorationLine: "underline",
    // marginHorizontal: 12,
  },
  confirmationModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
  },
  floatIcon: {
    position: "absolute",
    right: 0,
    bottom: 12,
    justifyContent: "center",
    alignItems: "right",
    paddingHorizontal: 10,
    zIndex: 1,
  },
  confirmTxt: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff0000ea",
    // marginBottom: 4,  //replaced by gap from parent
    fontSize: 10,
  },
  // ///////
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
  icon: {
    width: 30,
    height: 30,
    right: 0,
    position: "absolute",
  },
  closeIcon: {
    alignContent:'flex-end',
    alignSelf:'flex-end',
    justifyContent:"flex-end",
    margin:8,
  },

});

export default RegistrationScreen;
