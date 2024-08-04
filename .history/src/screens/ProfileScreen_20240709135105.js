
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
  const {
    registerUser,
    loginUser,
    resetPassword,
    signOutUser,
    checkUserLoggedIn,
    user,
  } = authService();

  useEffect(() => {
    // initializeAuth()
    const fetchUserDetails = async () => {
      try {
        // const user = auth.currentUser;
        const user = await checkUserLoggedIn();

        console.log(user);
        if (user) {
          const firestoreInstance = getFirestore();
          const userDoc = await getDoc(
            doc(firestoreInstance, "users", user.uid)
          );
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
  }, []);
  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      console.log(user.displayName);
      console.log(user.phoneNumber);

      const firestoreInstance = getFirestore();
      await setDoc(doc(firestoreInstance, "users", user.uid), {
        name: userDetails.name,
        PhoneNumber: userDetails.phone,
        emergencyMessage: userDetails.emergencyMessage,
      });
      setUserDetails({
        ...userDetails,
        name: user.displayName,
      });
      setIsDirty(false);
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error updating user details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (field, text) => {
    setUserDetails({ ...userDetails, [field]: text });
    setIsDirty(true);
    Toast.show({
      type: "error",
      text1: "Error Updating Profile",
      text2: "An error occurred. Please try again later.",
      visibilityTime: 3000,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      //
      Toast.show({
        type: "success",
        text1: "Signed Out Successfully",
        visibilityTime: 3000,
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
  const initializeAuth = async () => {
    try {
      const user = await checkUserLoggedIn();

      if (user != null) {
        setCurrentUser(user);
        console.log("There is a user", user);
      } else {
        setContacts([]);
        console.log("Not logged in user");
      }
    } catch (error) {
      console.error("Error during authentication initialization:", error);
    } finally {
      // setLoading(false);
      setIsLoading(false);
    }
  };

  // handle navigations & Links
  const handleAboutScreen = () => {
    navigation.navigate("About");
  };

  const handleTerms = () => {
    console.log("Terms and Conditions screen");
  }

  const handlePrivacyPolicy = () => {
    console.log("Privacy Policy screen");
  }

  const handleHelp = () => {
    console.log("Help & Support Screen");
  }


  const handleLegal = () => {
    console.log("Legal screen");
  }


  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Card containerStyle={styles.card}>
          <ScrollView>
            <Text style={styles.cardText}>Basic</Text>

            <Text style={styles.title}>Name</Text>
            <Input
              // placeholder="Name"
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.name || ""}
              onChangeText={(text) => handleInputChange("name", text)}
            />

            <Text style={styles.title}>Email</Text>
            <Input
              // placeholder="Email"
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.email || ""}
              editable={false}
            />

             <Text style={styles.title}>Custom Emergency Message </Text>
            <Input
              placeholder="Emergency Message"
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
              value={userDetails?.emergencyMessage || ""}
              onChangeText={(text) =>
                handleInputChange("emergencyMessage", text)
              }
            />
            {isDirty && (
              <Button
                title={isLoading ? "Updating..." : "Update Profile"}
                onPress={handleUpdateProfile}
                buttonStyle={styles.updateButton}
                disabled={isLoading}
              />
            )}

            {/* <TouchableOpacity onPress={() => navigation.navigate("")}>
              <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={handleAboutScreen}>
              <Text style={styles.changePasswordText}>About</Text>
            </TouchableOpacity>

            {/* External Links to owner sites */}
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "black",
  },
  center: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  cardContainer: {
    alignItems: "center",
  },
  card: {
    width: 373,
    // height: 595,
    backgroundColor: "#125127",
    padding: 20,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "left",
    color: "white",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 12,
    letterSpacing: 0.15,
    textAlign: "left",
    color: "white",
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 12,
    letterSpacing: 0.15,
    textAlign: "left",
    color: "#5BA64F",
    backgroundColor: "#125127",
    padding: 5,
    marginBottom: 10,
  },
  legalText: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "left",
    color: "white",
    marginTop: 55,
  },
  privacyPolicyText: {
    width: 393,
    height: 20,
    color: "#5BA64F",
    marginTop: 30,
  },
  termsConditionsText: {
    width: 393,
    height: 20,
    color: "#5BA64F",
    marginTop: 5,
  },
  signOutText: {
    width: 393,
    height: 20,
    marginTop: 5,
    color: "#FF4D00",
    textAlign: "left",
    marginTop: 70,
  },
  updateButton: {
    backgroundColor: "#5BA64F",
    margin: 10,
  },
  
});
export default ProfileScreen;
