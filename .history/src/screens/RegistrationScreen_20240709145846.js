import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import InputText from "../components/InputText";
import authService from "../services/authService";
import Toast from "react-native-toast-message";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const RegistrationScreen = ({ onLogin, onRegister, closeModal }) => {
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { registerUser } = authService();

  const handlePasswordChange = (text, isConfirmPassword = false) => {
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
      });
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
        type: 'error',
        position: 'bottom',
        text1: 'Registration failed',
        text2: 'Password doesn\'t meet the requirements',
        visibilityTime: 3000
      });
      setLoading(false);
      return;
    }

    try {
      await registerUser(email, password, name, phone);
      setLoading(false);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Registration successful',
        visibilityTime: 3000,
      });
      closeModal();
      navigation.navigate('Login'); // Navigate to Login screen after successful registration

      // Clear input fields after successful registration
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => closeModal()}>
        <FontAwesome name="times" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.signupForm}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Signup</Text>
          <View>
            <InputText
              style={styles.input}
              placeholder="Name & Surname"
              placeholderTextColor="white"
              onChangeText={(text) => setName(text)}
              label={"Full Name"}
            />
            {nameError && <Text style={styles.errorText}>{nameError}</Text>}
          </View>
          <View>
            <InputText
              style={styles.input}
              placeholder="username@example.com"
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
              label={"Mobile Number"}
            />
            {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
          </View>
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
              accessibilityLabel="Show Password"
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
          <View>
            <InputText
              style={styles.input}
              placeholder="Matching Password"
              onChangeText={(text) => handlePasswordChange(text, true)}
              secureTextEntry={!showPassword}
              label={"Confirm Password"}
            />
            {reenterPasswordError && (
              <Text style={styles.errorText}>{reenterPasswordError}</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
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
    padding: 10
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
    justifyContent: 'center',
    alignItems: "center"
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
  errorText: {
    color: "#ff0000ea",
    fontSize: 10,
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
  closeIcon: {
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: "flex-end",
    margin: 8,
    width: 48,
    height: 48,
  },
});

export default RegistrationScreen;
