import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import InputText from "../components/InputText";
import authService from "../services/authService";
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ onRegister, onLogin, onForgotPass, closeModal, openRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = authService(); // Assuming these are your auth service functions
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await loginUser(email, password);
      if (user) {
        console.log(user.email + ' login page line 26');
        closeModal();
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          visibilityTime: 3000,
        });
      }
      setLoading(false);
    } catch (error) {
      Alert.alert(error.message);
      console.log(error);
      setLoginAttempts(loginAttempts + 1);
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Incorrect email or password',
        text2: 'Please try again',
        visibilityTime: 3000,
      });

      // Check if login attempts exceed the limit (e.g., 3)
      if (loginAttempts >= 2) {
        // Block the user or perform any other action (e.g., show a message)
        Alert.alert('Login attempts exceeded. Your account is locked.');
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
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="username@123.com"
              placeholderTextColor="#f2f2f2"
              label={"Email"}
              autoCompleteType="email"
            />

            <View style={styles.passwordInputContainer}>
              <InputText
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.passwordInput}
                placeholder="password"
                secureTextEntry={!showPassword} // Toggle based on showPassword state
                placeholderTextColor="#f2f2f2"
                label={"Password"}
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
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#002E15",
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
    width: 300,
    height: 48,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    bottomBorderColor: "white",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    borderBottomWidth: 1,
    borderColor: "white",
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
  linksContainer: {
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  Fbutton: {
    height: 48,
  },
  Rbutton: {
    height: 48,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    margin: 8,
    width: 48,
    height: 48,
  },
});
