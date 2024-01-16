import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import InputText from "../components/InputText";
import Button from "../components/Button";
import registerUser from "../services/authService";
import Toast from "react-native-toast-message";

const RegistrationScreen = ({ closeModal }) => {
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
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (text, isConfirmPassword = false) => {
    // Handle changes for the "Password" field
    if (!isConfirmPassword) {
      setPassword(text);
      // Password strength validation
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
      if (!text.match(passwordRegex)) {
        setPasswordError(
          "Password must contain at least 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character"
        );
      } else {
        setPasswordError(null);
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
      // Reset previous validation errors
      setNameError(null);
      setEmailError(null);
      setPhoneNumberError(null);
      setPasswordError(null);
      setReenterPasswordError(null);

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
          type: 'error',
          position: 'bottom',
          text1: 'Registration failed',
          text2: 'Password doesn\'t meet the requirements',
          visibilityTime: 3000
        });
        return;
      }

      // Create a user using Firebase Authentication
      const user = await registerUser(email, password, name, phone);
      if (user) {
        console.log(user.email + ' registered successfully');
        closeModal();
      }
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
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {/* Signup Form */}
      <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
        <Ionicons name="ios-close" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.signupForm}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Signup</Text>
          <InputText
            style={styles.input}
            placeholder="Name & Surname"
            placeholderTextColor="white"
            onChangeText={(text) => setName(text)}
            label={"Full Name"}
          />
          {nameError && <Text style={styles.errorText}>{nameError}</Text>}
          <InputText
            style={styles.input}
            placeholder="username@123.com"
            placeholderTextColor="white"
            onChangeText={(text) => setEmail(text)}
            label={"Email"}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          <InputText
            style={styles.input}
            placeholder="0123456789"
            placeholderTextColor="white"
            onChangeText={(text) => setPhoneNumber(text)}
            label={"Number"}
          />
          {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
          <View style={styles.TextInputGroup}>
            <InputText
              style={styles.input}
              placeholder="Password"
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
              onPress={toggleShowPassword}
            />
          </View>
          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
          <InputText
            style={styles.input}
            placeholder="Confirm Password"
            onChangeText={(text) => handlePasswordChange(text, true)}
            secureTextEntry={!showPassword}
            label={"Confirm Password"}
          />
          {reenterPasswordError && (
            <Text style={styles.errorText}>{reenterPasswordError}</Text>
          )}
          <Button onPress={handleRegister} label="CREATE ACCOUNT" />
          <View style={styles.loginNav}>
            <Text style={styles.loginNav}>Already have an account?</Text>
            <TouchableOpacity onPress={closeModal}>
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
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f2f2f2",
    textAlign: "center",
  },
  signupForm: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#002E15",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 20,
    color: "white",
    display: "flex",
    flexDirection: "column",
  },
  formContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
  },
  TextInputGroup: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  errorText: {
    color: "#ff0000ea",
    fontSize: 10,
  },
  loginNav: {
    flexDirection: "row",
    color: "#f2f2f2",
    gap: 16,
  },
  loginTxt: {
    color: "#C8FFD7",
    textDecorationLine: "underline",
  },
});

export default RegistrationScreen;
