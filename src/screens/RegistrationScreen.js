import React, { useEffect, useState ,useRef} from "react";
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
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { registerUser} = authService()

  // Refs for each input
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

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
  
    // Trim leading and trailing spaces
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
  
    // Validate all fields
    if (!trimmedName || !trimmedEmail || !trimmedPhone || !password || !reenterPassword) {
      if (!trimmedName) setNameError("Name is required");
      if (!trimmedEmail) setEmailError("Email is required");
      if (!trimmedPhone) setPhoneNumberError("Mobile number is required");
      if (!password) setPasswordError("Password is required");
      if (!reenterPassword)
        setReenterPasswordError("Re-enter password is required");
  
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Registration failed',
        text2: 'Please fill in the required fields',
        visibilityTime: 6000,
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
        text2: 'Password does not match',
        visibilityTime: 6000,
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
        text2: 'Password doesn’t meet the requirements',
        visibilityTime: 3000,
      });
      setLoading(false);
      return;
    }
  
    try {
      // Register the user with trimmed values
      await registerUser(trimmedEmail, password, trimmedName, trimmedPhone);
  
      closeModal();
      setLoading(false);
  
      // Clear fields
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
    }
    setLoading(false);
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
              ref={nameRef}
              style={styles.input}
              placeholder="Name & Surname"
              placeholderTextColor="white"
              onChangeText={(text) => setName(text)}
              label={"Full Name"}
              onSubmitEditing={() => emailRef.current.focus()}
              returnKeyType="next"
            />
            {nameError && <Text style={styles.errorText}>{nameError}</Text>}
          </View>
          
          <View>
          <InputText
              ref={emailRef}
              style={styles.input}
              placeholder="username@example.com"
              placeholderTextColor="white"
              onChangeText={(text) => setEmail(text)}
              label={"Email"}
              onSubmitEditing={() => phoneRef.current.focus()}
              returnKeyType="next"
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>
          <View>
          <InputText
              ref={phoneRef}
              style={styles.input}
              placeholder="0123456789"
              placeholderTextColor="white"
              onChangeText={(text) => setPhoneNumber(text)}
              label={"Number"}
              onSubmitEditing={() => passwordRef.current.focus()}
              returnKeyType="next"
            />
            {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
          </View>

          <View>
          <View style={styles.TextInputGroup}>
              <InputText
                ref={passwordRef}
                style={styles.input}
                placeholder="Password123@"
                onChangeText={(text) => handlePasswordChange(text)}
                secureTextEntry={!showPassword}
                label={"Password"}
                onSubmitEditing={() => confirmPasswordRef.current.focus()}
                returnKeyType="next"
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
              ref={confirmPasswordRef}
              style={styles.input}
              placeholder="Matching Password"
              onChangeText={(text) => handlePasswordChange(text, true)}
              secureTextEntry={!showPassword}
              label={"Confirm Password"}
              onSubmitEditing={handleRegister}
              returnKeyType="done"
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

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            {loading ? (
              <Modal transparent={true} visible={loading}>
              <View style={styles.modalContainer}>
                <ActivityIndicator size="small" color="blue" />
              </View>
            </Modal>
            ) : (
              <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
            )}
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
  onLogin :{
    width: 48,
    height: 48,
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
    color: "white",
  },
  closeIcon: {
    alignContent:'flex-end',
    alignSelf:'flex-end',
    justifyContent:"flex-end",
    margin:8,
    width: 48,
    height: 48,
  },
    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

});

export default RegistrationScreen;
