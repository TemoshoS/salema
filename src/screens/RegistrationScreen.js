import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import { auth } from '../services/firebaseService';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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


  const handleRegister = async () => {
    try {
      //Reset previous validation errors and user exists message
      setNameError(null);
      setEmailError(null);
      setPhoneNumberError(null);
      setPasswordError(null);
      setReenterPasswordError(null);
      setUserExistsMessage('');


      // Validation (You can add more validation as needed)
      if (!name) {
        setNameError('Name is required');
        return;
      }

      else if  (!email) {
        setEmailError('Email is required');
        return;
      }

      else if (!phone) {
        setPhoneNumberError('Phone is required');
        return;
      }

      else if (!password) {
        setPasswordError('Password is required');
        return;
      }

      else if (!reenterPassword) {
        setReenterPasswordError('Re-enter password is required');
        return;
      }

      // Password strength validation
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;
      if (!password.match(passwordRegex)) {
        setPasswordError('Password must contain at least 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character');
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

    
      setIsConfirmationVisible(true);



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

  const hideConfirmation =()=>{
    navigation.navigate('Login');
    setIsConfirmationVisible(false);
  }

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
          <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={19}
              color='white'
            />
          </TouchableOpacity>

        
        {reenterPasswordError && <Text style={styles.errorText}>{reenterPasswordError}</Text>}

        {userExistsMessage && <Text style={styles.successMessage}>{userExistsMessage}</Text>}

        <View style={styles.passwordStrength}>
          {passwordStrength && <Text>Password Strength: {passwordStrength}</Text>}
        </View>


        <TouchableOpacity style={styles.createAccountButton}
          onPress={handleRegister} >
          <Text style={styles.TextButton}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  showPasswordButton:{
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
