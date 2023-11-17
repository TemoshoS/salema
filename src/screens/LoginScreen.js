import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  // Initialize the auth variable
  const auth = getAuth();
  // Function to handle the login process
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate('Home'); // Redirect to the Home page upon successful login
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          // Handle user not found error
          console.error('User does not exist.');
        } else if (error.code === 'auth/wrong-password') {
          // Handle wrong password error
          console.error('Wrong password.');
        } else {
          // Handle other errors
          console.error('Login failed:', error.message);
        }
      });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Union.png')}
        style={styles.image}
      />
      <Image
        source={require('../../assets/Vector.png')}
        style={styles.imageVector}
      />
      <Text style={styles.boldText}>Shake to Alert</Text>
      <Text style={styles.readyText}>READY</Text>
      {/* Signup Form */}
      <View style={styles.signupForm}>
        <Text style={[styles.signupText, { color: 'white' }]}>Login</Text>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
        />
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword} // Hide the password with stars
          placeholderTextColor="white"
        />
        <TouchableOpacity
          style={styles.togglePasswordButton}
          onPress={togglePasswordVisibility}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={styles.LoginButton}>
          <Text style={styles.TextButton}>Login</Text>
        </TouchableOpacity>
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
            <Text style={{ color: '#FFF' }}>Forgot password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: '#FFF' }}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Image at the bottom center */}
      <Image
        source={require('../../assets/undraw_different_love_a-3-rg 1.png')}
        style={styles.bottomImage}
      />
      {/* Bottom Tab */}
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
    bottom: 100,
    textAlign: 'center',
  },
  signupForm: {
    width: 350,
    height: 300,
    padding: 30,
    borderRadius: 20,
    backgroundColor: '#002E15',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 210,
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
  LoginButton: {
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
    bottom: -10,
  },
  linksContainer: {
    flexDirection: "row",
    gap: 100,
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
    bottom: 2,
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
  togglePasswordButton: {
    position: 'absolute',
    right: 30,
    top: 145,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  eyeIcon: {
    width: 30,
    height: 30,
  },
});
export default LoginScreen;