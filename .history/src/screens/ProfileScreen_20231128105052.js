import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Text, Card, Input } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { signOutUser } from '../services/authService';
const ProfileScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [auth]);
  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      console.log(user.displayName);
      console.log(user.phoneNumber);
      

      const firestoreInstance = getFirestore();
      await setDoc(doc(firestoreInstance, 'users', user.uid), {
        name: userDetails.name,
        PhoneNumber: userDetails.phone,
        emergencyMessage: userDetails.emergencyMessage,
      });
      setUserDetails({
        ...userDetails,
        name: user.displayName,
      });
      setIsDirty(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (field, text) => {
    setUserDetails({ ...userDetails, [field]: text });
    setIsDirty(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Card containerStyle={styles.card}>
          <ScrollView>
            <Text style={styles.cardText}>Basic</Text>
            <Input
              placeholder='Name'
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.name || ''}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <Input
              placeholder='Email'
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.email || ''}
              editable={false}
            />
            <Input
              placeholder='Emergency Message'
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.emergencyMessage || ''}
              onChangeText={(text) => handleInputChange('emergencyMessage', text)}
            />
            {isDirty && (
              <Button
                title={isLoading ? 'Updating...' : 'Update Profile'}
                onPress={handleUpdateProfile}
                buttonStyle={styles.updateButton}
                disabled={isLoading}
              />
            )}
            <Text style={styles.changePasswordText}>Change Password</Text>
            <Text style={styles.legalText}>Legal</Text>
            <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
            <Text style={styles.termsConditionsText}>Terms & Conditions</Text>
            <TouchableOpacity>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </Card>
      </View>
    </View>
  );
};const styles = StyleSheet.create({
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
    // height: 595,
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
  updateButton: {
    backgroundColor: '#5BA64F',
    margin: 10,
  },
});
export default ProfileScreen;