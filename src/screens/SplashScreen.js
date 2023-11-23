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

const SplashScreen = () => {
  const navigation = useNavigation();

  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [isForgotPassModalVisible, setForgotPassModalVisible] = useState(false);
  const bottomSheetRef = useRef(null);

  const handleLogin = () => {
    setLoginModalVisible(true);
  };

  const handleSignup = () => {
    setSignupModalVisible(true);
  };

  const closeModal = () => {
    setLoginModalVisible(false);
    setSignupModalVisible(false);
  };

  return (
    <View style={styles.container}>
    <LoginModal isVisible={isLoginModalVisible} onClose={closeModal} />
      <SignupModal isVisible={isSignupModalVisible} onClose={closeModal} />
      
      <Image
        source={require("../../assets/Union.png")}
        style={styles.logoImg}
        accessibilityLabel="logo"
      />
      <Text>Your safety is just a shake away</Text>
      {/* Staus image */}

      <View style={styles.textContent}>
        {/* HERE IS THE STATUS OF THE SHAKE APP {IN USE OR NOT} */}
        <ShakeFeedback />

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
    paddingHorizontal: 8,
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
