import React from 'react';
import { Image, StyleSheet, Text, TextInput, View, Button, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-web';

const RegistrationScreen = () => {
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
          bottomBorderColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="white"
         
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true} // Hide the password with stars
          placeholderTextColor="white"
          bottomBorderColor="white"
        />
        <TouchableOpacity style= {styles.createAccountButton}>  
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
