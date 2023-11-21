import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";
import InputText from "../components/InputText";
import ShakeFeedback from "../components/ShakeFeedback";
import { resetPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

const handleForgotPassword = async () => {  
  try {
    await resetPassword(email);
  } catch (error) {
    
  }
}
  return (
    <View style={styles.container}>
      <View style={styles.formContent}>
        <Image
          source={require("../../assets/Union.png")}
          style={styles.logoImg}
          accessibilityLabel="logo image"
        />
        <ShakeFeedback />
        <Text style={styles.TextButton}>Your safety is just a shake away</Text>
        {/* Staus image */}

        <View style={styles.textContent}>
          {/* HERE IS THE STATUS OF THE SHAKE APP {IN USE OR NOT} */}

          <Text style={styles.boldText}>Shake to Alert</Text>
          <Text style={styles.readyText}>READY</Text>
          {/* <Text style={styles.title}>"Shake to Alert"</Text> */}
        </View>
      </View>

      {/* Reset Password Form Section */}
      <View style={styles.overlay}></View>
      <View style={styles.signupForm}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Reset Password</Text>

          <InputText
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            placeholderTextColor="#f2f2f2"
          />


        </View>

        <View style={styles.buttonGroup}>
          <Button
            onPress={handleForgotPassword}
            title="Reset Password"
            altText={"Reset Password"}
            color={"#055a2b"}
          />
         
        </View>
      </View> 

      {/* Image at the bottom center */}
      <Image
        source={require("../../assets/undraw.png")}
        style={styles.bottomImage}
      />
    </View>
  );
};

// export default ForgotPasswordScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 25,
    // paddingHorizontal: 8,
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
    fontWeight: "bold",
    fontSize: 20,
    // marginTop: -160,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f2f2f2",
    textAlign: "center",
  },
  readyText: {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: "400",
    fontSize: 15,
    width: 55,
    height: 7,
    bottom: 100,
    textAlign: "center",
  },
  signupForm: {
    padding: 30,
    borderRadius: 16,
    backgroundColor: "#002E15",
    alignItems: "flex-start",
    justifyContent: "center",
    // bottom: 210,
    gap: 20,
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    marginHorizontal: 8,
    bottom: 100,
  },
  signupText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  formContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  buttonGroup: {
    width: "100%",
    flexDirection: "column",
    // flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
    marginTop: 12,
  },
  buttonSection: {
    width: "100%",
    height: "auto",
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  input: {
    width: 300,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    bottomBorderColor: "white",
  },
  LoginButton: {
    width: 300,
    height: 42,
    padding: 8,
    paddingHorizontal: 33,
    borderRadius: 40,
    backgroundColor: "#C8FFD7",
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.5,
    textAlign: "center",
    color: "black",
    bottom: -10,
  },
  linksContainer: {
    flexDirection: "row",
    gap: 100,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  TextButton: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    margin: 5,
  },
  bottomImage: {
    zIndex: -1, //sent to back z-index to allow over lay
    width: 200,
    height: 200,
    position: "absolute",
    bottom: 6,
  },
  bottomTab: {
    width: 393,
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingHorizontal: 10,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  greenTabText: {
    color: "green",
    fontWeight: "bold",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tabIcon: {
    width: 10,
    height: 10,
    marginLeft: 5,
  },
  togglePasswordButton: {
    position: "absolute",
    right: 30,
    top: 145,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
  eyeIcon: {
    width: 30,
    height: 30,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.601)",
  },

  // //////////////////////
  textContent: {
    paddingHorizontal: 0,
    wordWrap: "break-word",
    alignItems: "center",
    justifyContent: "space-between",
    textAlign: "center",
    width: "100%",
    gap: 6,
  },
  logoImg: {
    // flex: 1,
    width: 100,
    height: 24,
    marginTop: 24,
    resizeMode: "contain",
    // marginVertical: 20,
  },
  BgImage: {
    width: 180,
    height: 200,
    // marginTop: -140,
    resizeMode: "cover",
    // marginVertical: 20,
  },
});

export default ForgotPassword;
