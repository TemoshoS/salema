import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigation = useNavigation();

  const handleLogin = async (email, password) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // If the login is successful, you can navigate to the Home screen.
      navigation.navigate('Home'); // Make sure you have the appropriate navigation route set up.
    } catch (error) {
      // Handle login errors
      const errorCode = error.code;
  
      if (errorCode === 'auth/wrong-password') {
        // Handle wrong password error
        console.error('Wrong password. Please check your password.');
      } else if (errorCode === 'auth/user-not-found') {
        // Handle user not found error (user is not registered)
        console.error('User not found. Please register or check your email.');
      } else {
        // Handle other errors
        console.error('Login failed:', error);
      }
    }
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
              secureTextEntry={true} // Hide the password with stars
              placeholderTextColor="white"
            />
            <TouchableOpacity onPress={handleLogin} style= {styles.LoginButton}>  
             <Text style={styles.TextButton}>Login</Text>
            
              
             
           </TouchableOpacity>
           
           <View style={styles.linksContainer }>
           <Text style={{ color: '#FFF' }}>Forgot password</Text>
           <Text style={{ color: '#FFF' }}>Register</Text>
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
        bottom:100,
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
          flexDirection:"row",
          gap:100,
          
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
