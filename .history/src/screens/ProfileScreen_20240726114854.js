import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Card, Input } from "react-native-elements";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import authService from "../services/authService";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser, loginUser, resetPassword, signOutUser, checkUserLoggedIn, user } = authService();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await checkUserLoggedIn();
        if (user) {
          const firestoreInstance = getFirestore();
          const userDoc = await getDoc(doc(firestoreInstance, "users", user.uid));
          const userData = userDoc.data();
          setUserDetails({
            name: user.displayName,
            email: user.email,
            phone: userData?.PhoneNumber || "",
            emergencyMessage: userData?.emergencyMessage || "",
          });
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [checkUserLoggedIn]);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const firestoreInstance = getFirestore();
      await setDoc(doc(firestoreInstance, "users", user.uid), {
        name: userDetails.name,
        PhoneNumber: userDetails.phone,
        emergencyMessage: userDetails.emergencyMessage,
      });
      setUserDetails((prevDetails) => ({ ...prevDetails, name: user.displayName }));
      setIsDirty(false);
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      Toast.show({
        type: "error",
        text1: "Error Updating Profile",
        text2: "An error occurred. Please try again later.",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, text) => {
    setUserDetails((prevDetails) => ({ ...prevDetails, [field]: text }));
    setIsDirty(true);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      Toast.show({
        type: "success",
        text1: "Signed Out Successfully",
        visibilityTime: 3000,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "LandingPage" }],
      });
    } catch (error) {
      console.error("Error signing out:", error);
      Toast.show({
        type: "error",
        text1: "Error Signing Out",
        text2: "An error occurred. Please try again later.",
        visibilityTime: 3000,
      });
    }
  };

  const handleAboutScreen = () => {
    navigation.navigate("About");
  };

  const handleTerms = () => {
    navigation.navigate("Terms");
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleHelp = () => {
    navigation.navigate("Help");
  };

  const handleLegal = () => {
    navigation.navigate("Legal");
  };

  const handleMissingScreen = () => {
    navigation.navigate("MissingScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Card containerStyle={styles.card}>
          <ScrollView>
            <Text style={styles.cardText}>Basic</Text>
            <Text style={styles.title}>Name</Text>
            <Input
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.name || ""}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            <Text style={styles.title}>Email</Text>
            <Input
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.email || ""}
              editable={false}
            />
            <Text style={styles.title}>Custom Emergency Message</Text>
            <Input
              placeholder="Emergency Message"
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.emergencyMessage || ""}
              onChangeText={(text) => handleInputChange("emergencyMessage", text)}
            />
            {isDirty && (
              <Button
                title={isLoading ? "Updating..." : "Update Profile"}
                onPress={handleUpdateProfile}
                buttonStyle={styles.updateButton}
                disabled={isLoading}
              />
            )}
            <TouchableOpacity onPress={handleMissingScreen}>
              <Text style={styles.changePasswordText}>Missing</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAboutScreen}>
              <Text style={styles.changePasswordText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLegal}>
              <Text style={styles.legalText}>Legal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrivacyPolicy}>
              <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTerms}>
              <Text style={styles.termsConditionsText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </ScrollView>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    alignItems: "center",
  },
  card: {
    width: 373,
    backgroundColor: "#125127",
    padding: 20,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontSize: 12,
    color: "white",
  },
  changePasswordText: {
    fontSize: 16,
    color: "#5BA64F",
    backgroundColor: "#125127",
    padding: 5,
    marginBottom: 10,
  },
  legalText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginTop: 55,
  },
  privacyPolicyText: {
    color: "#5BA64F",
    marginTop: 30,
  },
  termsConditionsText: {
    color: "#5BA64F",
    marginTop: 5,
  },
  signOutText: {
    color: "#FF4D00",
    marginTop: 70,
  },
  updateButton: {
    backgroundColor: "#5BA64F",
    margin: 10,
  },
});

export default ProfileScreen;
