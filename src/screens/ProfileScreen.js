import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Icon, Text, Card, Input } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const handleSignOut = () => {
    signOutUser();
    navigation.navigate('LandingPage');
  }
  const auth = getAuth();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth.currentUser;
  
        if (user) {
          const firestoreInstance = getFirestore();
          const userDoc = await getDoc(doc(firestoreInstance, 'users', user.uid));
          const userData = userDoc.data();
  
          setUserDetails({
            name: user.displayName,
            email: user.email,
            phone: userData?.PhoneNumber || '',
            emergencyMessage: userData?.emergencyMessage || '',
          });
        } else {
          // Handle the case when there is no authenticated user
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, [auth]);
  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Button
          title="MY ACCOUNT"
          type="clear"
          icon={
            <Icon
              name="arrow-back"
              type="material-symbols"
              size={18}
              color="black"
            />
          }
          iconLeft
          titleStyle={styles.buttonText}
        />
      </View> */}
      <View style={styles.center}>
        <Image
          source={require('../../assets/Ellipse.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardContainer}>
        <Card containerStyle={styles.card}>
          <Text style={styles.cardText}>Basic</Text>
          <Input
            placeholder="Name"
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            value={userDetails?.name || ''}
          />
          <Input
            placeholder="Email"
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            value={userDetails?.email || ''}
          />
          <Input
            placeholder="Emergency Message"
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            value={userDetails?.emergencyMessage || ''}
          />
          <Text style={styles.changePasswordText}>Change Password</Text>
          <Text style={styles.legalText}>Legal</Text>
          <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
          <Text style={styles.termsConditionsText}>Terms & Conditions</Text>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Card>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  center: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    width: 373,
    height: 595,
    backgroundColor: '#125127',
    padding: 20,
    borderRadius: 10,
  },
  cardText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: 'left',
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 12,
    letterSpacing: 0.15,
    textAlign: 'left',
    color: 'white',
  },
  changePasswordText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 12,
    letterSpacing: 0.15,
    textAlign: 'left',
    color: '#5BA64F',
    backgroundColor: '#125127',
    padding: 5,
    marginBottom: 10,
  },
  legalText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: 'left',
    color: 'white',
    marginTop: 55,
  },
  privacyPolicyText: {
    width: 393,
    height: 20,
    color: '#5BA64F',
    marginTop: 30,
  },
  termsConditionsText: {
    width: 393,
    height: 20,
    color: '#5BA64F',
    marginTop: 5,
  },
  signOutText: {
    width: 393,
    height: 20,
    marginTop: 5,
    color: '#FF4D00',
    textAlign: 'left',
    marginTop: 70
  },
});
export default ProfileScreen;