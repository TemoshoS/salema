import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { auth } from '../server/firebaseService';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [reenterPasswordError, setReenterPasswordError] = useState(null);
  const [userExistsMessage, setUserExistsMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      // Reset errors
      setNameError('');
      setEmailError('');
      setPhoneNumberError('');
      setPasswordError('');
      setReenterPasswordError('')

      // Validation (You can add more validation as needed)
      if (!name) {
        setNameError('Name is required');
        return;
      }

      if (!email) {
        setEmailError('Email is required');
        return;
      }

      if (!phone) {
        setPhoneNumberError('Phone is required');
        return;
      }

      if (!password) {
        setPasswordError('Password is required');
        return;
      }

      if (!reenterPassword) {
        setReenterPasswordError('Re-enter password is required');
        return;
      }

      // Password strength validation
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{7,}$/;
      if (!password.match(passwordRegex)) {
        setPasswordError('Password must contain at least 7 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character');
        return;
      }

      if (password !== reenterPassword) {
        setReenterPasswordError('Passwords do not match');
        return;
      }

      // Create a user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's display name (optional)
      await updateProfile(userCredential.user, {
        displayName: name,
        phoneNumber: phone,
      });

      // You can do more after successful registration, e.g., navigate to the next screen

      setName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setReenterPassword('');
      
      setUserExistsMessage('Account created successfully.');

      

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('Email is already in use');
      } else {
        console.error('Registration error:', error);
      }
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('/assets/union.png')}
        style={styles.image}
      />
      <Image
        source={require('/assets/Vector.png')}
        style={styles.imageVector}
      />
      <Text style={styles.boldText}>Shake to Alert</Text>
      <Text style={styles.readyText}>READY</Text>

      {/* Signup Form */}
      <View style={styles.signupForm}>
        <Text style={[styles.signupText, { color: 'white' }]}>SignUp</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="white"
          onChangeText={(text) => setName(text)}
        />
        {nameError && <Text style={styles.errorText}>{nameError}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
          onChangeText={(text) => setEmail(text)}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}


        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="white"
          onChangeText={(text) => setPhoneNumber(text)}
        />
        {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}


        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={(text) => setReenterPassword(text)}
          secureTextEntry={!showPassword}
        />
        {reenterPasswordError && <Text style={styles.errorText}>{reenterPasswordError}</Text>}

        {userExistsMessage && <Text style={styles.successMessage}>{userExistsMessage}</Text>}

        <View style={styles.passwordStrength}>
          {passwordStrength && <Text>Password Strength: {passwordStrength}</Text>}
        </View>

        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
          <Text>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
        </TouchableOpacity>









        <TouchableOpacity style={styles.createAccountButton}
          onPress={handleRegister} >
          <Text style={styles.TextButton}>CREATE ACCOUNT</Text>



        </TouchableOpacity>
      </View>

      {/* Image at the bottom center */}
      <Image
        source={require('/assets/undraw_different_love_a-3-rg 1.png')}
        style={styles.bottomImage}
      />

      {/* Bottom Tab */}
      <View style={styles.bottomTab}>
        <View style={styles.tabItem}>
          <View style={styles.tabContent}>
            <Text style={styles.greenTabText}>HELP</Text>
            <Image
              source={require('/assets/help_icon.png')}
              style={styles.tabIcon}
            />
          </View>
        </View>
        <View style={styles.tabItem}>
          <View style={styles.tabContent}>
            <Text style={styles.greenTabText}>SUPPORT</Text>
            <Image
              source={require('/assets/support_icon.png')}
              style={styles.tabIcon}
            />
          </View>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.greenTabText}>ABOUT US</Text>
        </View>
      </View>
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
});

export default RegistrationScreen;
