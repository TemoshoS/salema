import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const auth = getAuth(); // Get the Firebase Auth instance
  const navigation = useNavigation();

  const handleLogin = () => {
    // Clear previous error message
    setErrorMessage('');
  
    // Check if email and password are not empty
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
  
    // Authenticate user with Firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User successfully logged in
        console.log('User logged in:', userCredential.user);
        // You can navigate to another screen here, e.g., the home screen
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        // Handle specific error cases
        if (error.code === 'auth/user-not-found') {
          setErrorMessage('User does not exist. Please sign up.');
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Wrong password. Please try again.');
        } else {
          // Handle unexpected errors (you can log them for debugging)
          console.error('Login error:', error);
          setErrorMessage('An error occurred. Please try again later.');
        }
      });
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
              secureTextEntry={true} // Hide the password with stars
              placeholderTextColor="white"
            />
            <TouchableOpacity onPress={handleLogin} style= {styles.LoginButton}>  
             <Text style={styles.TextButton}>Login</Text>
            
              
             
           </TouchableOpacity>
<<<<<<< HEAD
           
           <View style={styles.linksContainer}>
=======

           {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
>>>>>>> 12f3b50bead7ab7f89fb2dc1c242bacae040cd2f
           <Text style={{ color: '#FFF' }}>Forgot password</Text>
           <Text style={{ color: '#FFF' }}>Register</Text>
           </View>
          </View>
    
          {/* Image at the bottom center */}
          <Image
            source={require('/assets/undraw_different_love_a-3-rg 1.png')}
            style={styles.bottomImage}
          />
    
          
        </View>
      );
    };

export default LoginScreen;
    
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
        height: 300,
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
        
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 300,
          marginTop: 10,
          
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
