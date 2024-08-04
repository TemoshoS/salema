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
import authService from "../services/authService";
import Toast from "react-native-toast-message";
import { FontAwesome } from '@expo/vector-icons';

const RegistrationScreen = ({onLogin, onRegister, closeModal}) => {
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
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { registerUser } = authService();

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
    setLoading(true);
    // Reset previous validation errors and user exists message
    setNameError(null);
    setEmailError(null);
    setPhoneNumberError(null);
    setPasswordError(null);
    setReenterPasswordError(null);
    setUserExistsMessage('');

    // Validate all fields
    if (!name || !email || !phone || !password || !reenterPassword) {
      if (!name) setNameError("Name is required");
      if (!email) setEmailError("Email is required");
      if (!phone) setPhoneNumberError("Mobile number is required");
      if (!password) setPasswordError("Password is required");
      if (!reenterPassword) setReenterPasswordError("Re-enter password is required");
     
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Registration failed',
        text2: 'Please fill in the required fields',
        visibilityTime: 3000,
      });
      setLoading(false);
      return;
    }

    // Check if the password and the confirm password match
    if (password !== reenterPassword) {
      setReenterPasswordError("Passwords do not match");
      
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Registration Failed',
        text2: 'Passwords do not match',
        visibilityTime: 3000,
      })
      setLoading(false);
      return;
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
    if (!password.match(passwordRegex)) {
      setPasswordError(
        "Password must contain at least 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character"
      );

      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Registration failed",
        text2: "Password doesn't meet the requirements",
        visibilityTime: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      await registerUser(email, password, name, phone);
      closeModal();
      setLoading(false);

      setName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setReenterPassword('');
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email is already in use");

        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: 'Email is already in use',
          visibilityTime: 3000,
        });
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Email is invalid");
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Registration Failed',
          text2: 'Invalid Email',
          visibilityTime: 3000,
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Registration Failed',
          text2: 'An error occurred. Please try again later.',
          visibilityTime: 3000,
        });
      }
      setLoading(false);
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
        <FontAwesome name="times" size={24} color="white" />
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
              placeholder="username@.com"
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
              <InputText
                style={styles.input}
                placeholder="Password123@"
                onChangeText={(text) => handlePasswordChange(text)}
                secureTextEntry={!showPassword}
                label={"Password"}
              />
              <TouchableOpacity
                style={styles.floatIcon}
                onPress={toggleShowPassword}
                accessibilityLabel="show password"
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={19}
                  color="white"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>
          <View>
            <InputText
              style={styles.input}
              placeholder="Matching Password"
              onChangeText={(text) => handlePasswordChange(text, true)} // Pass true to indicate it's the Confirm Password field
              secureTextEntry={!showPassword}
              label={"Confirm Password"}
            />
            {reenterPasswordError && <Text style={styles.errorText}>{reenterPasswordError}</Text>}
          </View>
          {userExistsMessage && (
            <Text style={styles.successMessage}>{userExistsMessage}</Text>
          )}
        </View>
        <Button
          title={"Signup"}
          onPress={handleRegister}
          backgroundColor={"#0B535B"}
          color={"white"}
        />
        {loading && <ActivityIndicator size="large" color="#fff" />}
      </View>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  closeIcon: {
    position: "absolute",
    top: 30,
    right: 30,
    zIndex: 1,
  },
  signupForm: {
    backgroundColor: "#202020",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  formContent: {
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    color: "white",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  successMessage: {
    color: "green",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  floatIcon: {
    position: "absolute",
    right: 15,
    top: 25,
    zIndex: 1,
  },
  icon: {
    color: "white",
  },
  TextInputGroup: {
    position: "relative",
  },
});
