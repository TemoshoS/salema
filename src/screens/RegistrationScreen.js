import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import { auth } from '../services/firebaseService';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Union from '../../assets/Union.png';
import Vector from '../../assets/Vector.png';
import InputText from '../components/InputText';

const RegistrationScreen = () => {
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

  const navigation = useNavigation();

  const handlePasswordChange = (text, isConfirmPassword = false) => {
    if (!isConfirmPassword) {
      // Handle changes for the "Password" field
      setPassword(text);

      // Password strength validation
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
      if (!text.match(passwordRegex)) {
        setPasswordError('Password must contain at least 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character');
      } else {
        setPasswordError(null); // Clear the error message when the password is valid.
      }
    } else {
      // Handle changes for the "Confirm Password" field
      setReenterPassword(text);

      // Check if the Confirm Password field matches the Password field
      if (text !== password) {
        setReenterPasswordError('Passwords do not match');
      } else {
        setReenterPasswordError(null);
      }
    }
  };



  const handleRegister = async () => {
    try {

      // Reset previous validation errors and user exists message
      setNameError(null);
      setEmailError(null);
      setPhoneNumberError(null);
      setPasswordError(null);
      setReenterPasswordError(null);
      setUserExistsMessage('');

      // Validate all fields
      if (!name || !email || !phone || !password || !reenterPassword) {
        if (!name) setNameError('Name is required');
        if (!email) setEmailError('Email is required');
        if (!phone) setPhoneNumberError('Mobile number is required')
        if (!password) setPasswordError('Password is required');
        if (!reenterPassword) setReenterPasswordError('Re-enter password is required');
        return;
      }

      // Check if the password and the confirm password match
      if (password !== reenterPassword) {
        setReenterPasswordError('Passwords do not match');
        return;
      }

      // Password strength validation
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
      if (!password.match(passwordRegex)) {
        setPasswordError('Password must contain at least 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character');
        return;
      }

      // Create a user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's display name (optional)
      await updateProfile(userCredential.user, {
        displayName: name,
        phoneNumber: phone,
      });

      setName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setReenterPassword('');

      setIsConfirmationVisible(true);



    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('Email is already in use');
      } else {
        setEmailError(null);
      }
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const hideConfirmation = () => {
    navigation.navigate('Login');
    setIsConfirmationVisible(false);
  }

  const handleLogin = () => {
    navigation.navigate('Login');
  }


  return (

    <View style={styles.container}>
      <Image
        source={Union}
        style={styles.image}
      />
      <Image
        source={Vector}
        style={styles.imageVector}
      />
      <Text style={styles.boldText}>Shake to Alert</Text>
      <Text style={styles.readyText}>READY</Text>

      {/* Signup Form */}
      <View style={styles.signupForm}>
        <Text style={[styles.signupText, { color: 'white' }]}>SignUp</Text>
        <InputText
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="white"
          onChangeText={(text) => setName(text)}
        />
        {nameError && <Text style={styles.errorText}>{nameError}</Text>}

        <InputText
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
          onChangeText={(text) => setEmail(text)}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}


        <InputText
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="white"
          onChangeText={(text) => setPhoneNumber(text)}
        />
        {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}


        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => handlePasswordChange(text)}
          secureTextEntry={!showPassword}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}



        <InputText
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={(text) => handlePasswordChange(text, true)} // Pass true to indicate it's the Confirm Password field
          secureTextEntry={!showPassword}
        />
        {reenterPasswordError && <Text style={styles.errorText}>{reenterPasswordError}</Text>}

        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={19}
            color='white'
          />
        </TouchableOpacity>


        {userExistsMessage && <Text style={styles.successMessage}>{userExistsMessage}</Text>}

        <View style={styles.passwordStrength}>
          {passwordStrength && <Text>Password Strength: {passwordStrength}</Text>}
        </View>


        <TouchableOpacity style={styles.createAccountButton}
          onPress={handleRegister} >
          <Text style={styles.TextButton}>CREATE ACCOUNT</Text>
        </TouchableOpacity>


        <View style={styles.loginNav}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginTxt}>Log in</Text>
          </TouchableOpacity>
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={isConfirmationVisible}
          onRequestClose={hideConfirmation}
        >
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmTxt}>User registered successfully</Text>
            <TouchableOpacity onPress={hideConfirmation}>
              <Text style={styles.confirmTxt}>Ok</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      {/* Image at the bottom center */}
      <Image
        source={require('../../assets/undraw_different_love_a-3-rg 1.png')}
        style={styles.bottomImage}
      />

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
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
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: -160,
  },
  readyText: {
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '400',
    fontSize: 15,
    width: 55,
    height: 7,
    marginTop: -180,
    textAlign: 'center',
  },
  signupForm: {
    width: 350,
    height: 350,
    padding: 30,
    borderRadius: 20,
    backgroundColor: '#002E15',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -170,
    gap: 20,
  },
  signupText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  input: {
    width: 300,
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'white',
    color: 'white',
    bottomBorderColor: 'white',

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  showPasswordButton: {
    left: 135,
    top: -42
  },

  errorText: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
  createAccountButton: {
    width: 300,
    height: 42,
    padding: 8,
    paddingHorizontal: 33,
    borderRadius: 40,
    backgroundColor: '#C8FFD7',
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 26,
    letterSpacing: 0.46000000834465027,
    textAlign: 'center',
    color: 'black',
  },
  TextButton: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    margin: 5,
  },
  bottomImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: 30,
  },
  bottomTab: {
    width: 393,
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: 10,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  greenTabText: {
    color: 'green',
    fontWeight: 'bold',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabIcon: {
    width: 10,
    height: 10,
    marginLeft: 5,
  },
  loginNav: {
    flexDirection: 'row'
  },
  loginTxt: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  confirmationModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  confirmTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default RegistrationScreen;
