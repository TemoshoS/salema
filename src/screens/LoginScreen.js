import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import InputText from "../components/InputText";
import authService from "../services/authService";
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ onRegister, onLogin, onForgotPass, closeModal, openRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = authService();
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    // Trim leading and trailing spaces from email and password
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      setLoading(true);
      const user = await loginUser(trimmedEmail, trimmedPassword);
      if (user) {
        closeModal();
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          visibilityTime: 3000, 
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      // Check if it's a network error
      if (error.message === 'Network Error') {
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Please check your internet connection.',
          visibilityTime: 6000,
          text1Style: { color: 'red' }, // Text color for the title
          text2Style: { color: 'red' }, // Text color for the message
        });
      }
      // Handle authentication errors (like invalid credentials)
      else if (error.code === 'auth/invalid-credential') {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Incorrect email or password. Please try again.',
          visibilityTime: 6000,
          text1Style: { color: 'red' },
          text2Style: { color: 'red' },
          
        });
      }
      // Handle too many login attempts (auth/too-many-requests)
    else if (error.code === 'auth/too-many-requests') {
      Toast.show({
        type: 'error',
        text1: 'Account Locked',
        text2: 'Too many failed login attempts. Please reset your password or try again later.',
        visibilityTime: 6000,
        text1Style: { color: 'red' },
        text2Style: { color: 'red' },
        style: { height: 100, paddingVertical: 20 },
      });
    }
      // Handle other errors (fallback)
      else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong. Please try again later.',
          visibilityTime: 6000,
          text1Style: { color: 'red' },
          text2Style: { color: 'red' },
        });
      }
      
    }
  };

  const handleForgotPassword = () => {
    onForgotPass();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => closeModal()}>
        <FontAwesome name="times" size={24} color="white" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.loginForm}>
          <View style={styles.formContent}>
            <Text style={styles.title}>Sign In</Text>

            <InputText
              ref={nameRef}
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="username@example.com"
              placeholderTextColor="#f2f2f2"
              label={"Email"}
              autoCompleteType="email"
              onSubmitEditing={() => passwordRef.current.focus()}
              returnKeyType="next"
            />

            <View style={styles.passwordInputContainer}>
              <InputText
                ref={passwordRef}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.passwordInput}
                placeholder="password"
                secureTextEntry={!showPassword}
                placeholderTextColor="#f2f2f2"
                label={"Password"}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.togglePasswordButton} onPress={togglePasswordVisibility}>
                <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.LoginButton} onPress={() => handleLogin()}>
            <Text>Login</Text>
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.Fbutton} onPress={() => handleForgotPassword()}>
              <Text style={{ color: "#FFF" }}>Forgot password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.Rbutton} onPress={() => openRegister()}>
              <Text style={{ color: "#FFF" }}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Toast />
    </View>
  );
};

export default LoginScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: "#f2f2f2",
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
    padding: 6,
    justifyContent: 'center',
  },
  input: {
    width: 100,
    height: 48,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    bottomBorderColor: "white",
  },
  LoginButton: {
    width: 300,
    height: 48,
    padding: 8,
    borderRadius: 40,
    backgroundColor: "#C8FFD7",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.5,
    alignItems: "center",
    justifyContent: 'center'
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    height: 48,
    color: "white",
    paddingLeft: 8,
  },
  togglePasswordButton: {
    position: "absolute",
    right: 10,
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
  textContent: {
    paddingHorizontal: 0,
    wordWrap: "break-word",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    width: "100%",
    gap: 6,
  },
  closeIcon: {
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: "flex-end",
    margin: 8,
    width: 48,
    height: 48,
  },
  Fbutton: {
    height: 48,
  },
  Rbutton: {
    height: 48,
  }
});
