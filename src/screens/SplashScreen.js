import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
// Navigation Contents
import { useNavigation } from "@react-navigation/native";
// components
import BottomNav from "../components/BottomNav";
import Button from "../components/Button";
import ShakeFeedback from "../components/ShakeFeedback";
// Modals
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import ForgotPassModal from "../components/ForgotPassModal";


const SplashScreen = () => {
  const navigation = useNavigation();

  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setSignupModalVisible] = useState(false);
  const [isForgotPassModalVisible, setForgotPassModalVisible] = useState(false);
  const bottomSheetRef = useRef(null);

  const handleLogin = () => {
    setLoginModalVisible(true);
  };

  const handleSignup = () => {
    setSignupModalVisible(true);
  };

  const closeModal = () => {
    console.log("closed modal on splash")
    setLoginModalVisible(false);
    setSignupModalVisible(false);
    setForgotPassModalVisible(false)
  };

  // close the modl login when user logs in:
  const handleLoginModalClose = () => {
    console.log("closed Log in modal on splash");
    setLoginModalVisible(false);
    setSignupModalVisible(false);
    setForgotPassModalVisible(false);
  };

  return (
    <View style={styles.container}>
  
      <Image
        source={require("../../assets/Union.png")}
        style={styles.logoImg}
        accessibilityLabel="logo"
      />
      <Text>Your safety is just a shake away</Text>
      {/* Staus image */}

      <View style={styles.textContent}>
        {/* HERE IS THE STATUS OF THE SHAKE APP {IN USE OR NOT} */}
        

        <Text style={styles.title}>"Shake to Alert"</Text>
        <Text style={styles.text}>
          In an emergency, every second counts, just give your phone a quick
          shake to send out an alert to your chosen contacts
        </Text>
      </View>

      {/* Backkground Image */}
      <Image
        source={require("../../assets/undraw.png")}
        style={styles.BgImage}
        accessibilityLabel="status signalimage"
      />
      {/* User buttons*/}
      <View style={styles.buttonSection}>
        <Button
          style={styles.bgGreen}
          title={"Signup"}
          onPress={() => handleSignup()}
          altText={"register"}
          color={"#055a2b"}
        />
        <Button
          style={styles.bgGreen}
          title={"Log in"}
          onPress={() => handleLogin()}
          altText={"Login"}
          color={"#055a2b"}
        />
      </View>

      {/* modals */}
      <LoginModal isVisible={isLoginModalVisible} onClose={handleLoginModalClose} />
      <SignupModal isVisible={isRegisterModalVisible} onClose={closeModal} />
      <ForgotPassModal isVisible={isForgotPassModalVisible} onClose={closeModal}/>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  bottom: {
    bottom: 0,
    // backgroundColor: "#062817",
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
  signalImg: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    // marging: 16,
    marginVertical: 20,
  },
  bottomTab: {
    bottom: 0,
    justifyContent: "flex-end",
  },
  textContent: {
    paddingHorizontal: 0,
    wordWrap: "break-word",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    columnGap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    // color: "#f2f2f2",
  },
  text: {
    // fontSize: 14,
    fontWeight: "normal",
    marginVertical: 5,
    textAlign: "center",
    paddingHorizontal: 12,
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
  bgGreen: {
    backgroundColor: "green",
  },
});

export default SplashScreen;
