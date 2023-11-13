import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { ScrollView } from "react-native-web";

const AboutScreen = () => {
  // Function to open the Facebook page in the browser
  const handleFacebookPress = () => {
    Linking.openURL("https://www.facebook.com/your-facebook-page");
  };

  // Function to open the Twitter page in the browser
  const handleTwitterPress = () => {
    Linking.openURL("https://twitter.com/your-twitter-page");
  };

  // Function to open the WhatsApp chat
  const handleWhatsAppPress = () => {
    Linking.openURL("https://wa.me/your-phone-number");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../assets/Arrow_Left.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>About us</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/Frame.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.socialIcons}>
          <TouchableOpacity onPress={handleFacebookPress}>
            <Image
              source={require("../../assets/facebook.png")}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTwitterPress}>
            <Image
              source={require("../../assets/twitter.png")}
              style={styles.latestTwitterIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWhatsAppPress}>
            <Image
              source={require("../../assets/whatsapp.png")}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Your Trusted Contacts</Text>
          <Text style={styles.Text}>
            Salema empowers you to build a network of people you trust in times
            of need. Add your friends, family, and close associates to your
            contacts list. They'll be the first to know when you need help.
          </Text>
        </View>
        <View style={styles.backgroundServiceStatus}>
          <Text style={styles.heading2}>Background Service Status</Text>
          <View style={styles.statusTextContainer}>
            <View style={styles.mainIconContainer}>
              <Image
                source={require("../../assets/main_icon.png")}
                style={styles.mainIcon}
              />
            </View>
            <Text style={styles.statusText2}>
              The core of Salema's magic lies in its ability to work quietly in
              the background, ready to jump into action when you shake your
              phone. Our background service is currently [Active/Inactive].
              Here's why it matters: It ensures a swift response in your moments
              of distress.
            </Text>
          </View>
        </View>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>
            Your safety is just a shake away.
          </Text>
        </View>
        <View style={styles.privacyPolicyContainer}>
          <TouchableOpacity onPress={handleTwitterPress}>
            <Text style={styles.extraLinks}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTwitterPress}>
            <Text style={styles.extraLinks}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 35,
    gap: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 25,
    letterSpacing: 0.4,
    color: "#000000",
  },
  icon: {
    width: 45,
    height: 20,
    marginLeft: -190,
    left: 0,
  },
  socialIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  smallIcon: {
    width: 20,
    height: 25,
    margin: 10,
  },
  latestTwitterIcon: {
    width: 20,
    height: 20,
    margin: 10,
  },
  imageContainer: {
    marginTop: 0,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: 400,
    height: 350,
  },
  headingContainer: {
    marginTop: -1,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000000",
    fontStyle: "plus jarkarta sans",
  },
  heading2: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000000",
    fontStyle: "plus jarkarta sans",
    marginTop: 20,
    marginLeft: 30,
  },
  Text: {
    fontSize: 15,
    fontStyle: "plus jakarta sans",
    color: "#000000",
    marginTop: 10,
    width: 353,
    height: 72,
  },
  statusText2: {
    fontSize: 15,
    fontStyle: "plus jakarta sans",
    color: "#000000",
    marginTop: 10,
    width: 353,
    height: 72,
    marginLeft: 15,
  },
  backgroundServiceStatus: {
    marginTop: 20,
  },
  mainIconContainer: {
    alignItems: "flex-start",
  },
  mainIcon: {
    width: 30,
    height: 30,
    marginTop: -34,
  },
  bottomTextContainer: {
    marginTop: 20,
    flexDirection: "column",
  },
  bottomText: {
    fontSize: 38,
    fontWeight: "700",
    color: "#000000",
    fontStyle: "plus jakarta sans",
    textAlign: "left",
    marginLeft: 30,
    marginTop: 40,
  },
  privacyPolicyContainer: {
    marginTop: 20,
    marginBottom: 20,
    color: "green",
    fontSize: 30,
    fontStyle: "plus jakarta sans",
    marginLeft: -220,
    gap: 16,
  },
  extraLinks: {
    color: "green",
  },
});

export default AboutScreen;
