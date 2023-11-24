import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";

import AppBar from "../components/Appbar";

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
  const handleExternalLink = () => {
    Linking.openURL("#");
  };

  return (
    <ScrollView stickyHeaderIndices={[0]}>
      <View style={styles.container}>
      {/* Topp App bar component */}
        {/* <AppBar navigation={navigation} showProfileIcon={false} screenName="About Us" /> */}
        
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
        <View style={styles.textContent}>
          <View style={styles.paragraphContainer}>
            <Text style={styles.heading}>Your Trusted Contacts</Text>
            <Text style={styles.text}>
              Salema empowers you to build a network of people you trust in
              times of need. Add your friends, family, and close associates to
              your contacts list. They'll be the first to know when you need
              help.
            </Text>
          </View>

          <View style={styles.paragraphContainer}>
            <View style={styles.backgroundServiceStatus}>
              <Image
                source={require("../../assets/main_icon.png")}
                style={styles.mainIcon}
              />
              <Text style={styles.heading}>Background Service Status</Text>
            </View>
            <View style={styles.statusTextContainer}>
              {/* <View style={styles.mainIconContainer}></View> */}
              <Text style={styles.text}>
                The core of Salema's magic lies in its ability to work quietly
                in the background, ready to jump into action when you shake your
                phone. Our background service is currently [Active/Inactive].
                Here's why it matters: It ensures a swift response in your
                moments of distress.
              </Text>
            </View>
          </View>
          <View style={styles.paragraphContainer}>
            <Text style={styles.bottomText}>
              Your safety is just a shake away.
            </Text>
            <View style={styles.privacyPolicyContainer}>
              <TouchableOpacity onPress={handleExternalLink}>
                <Text style={styles.extraLinks}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleExternalLink}>
                <Text style={styles.extraLinks}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 0,
  },
  paragraphContainer: {
    alignItems: "left",
    justifyContent: "flex-start",
    gap: 10,
  },
  textContent: {
    display: "flex",
    alignItems: "left",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 30,
    padding: 10,
    alignSelf: "stretch",
  },
  text: {
    // fontFamily: "Roboto",
    // fontWeight: "bold",
    // fontSize: 25,
    // letterSpacing: 0.4,
    color: "#000000",
    textAlign: "left",
    textTransform: "capitalize",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1", // Adjust as needed
    backgroundColor: "#ffffff", // Adjust as needed
  },
  icon: {
    width: 45,
    height: 20,
  },
  NavText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
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
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
    alignSelf: "stretch",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    fontStyle: "plus jarkarta sans",
  },
  Text: {
    fontSize: 14,
    fontStyle: "plus jakarta sans",
    color: "#000000",
    marginTop: 10,
    width: 400,
    // height: 72,
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
    alignItems: "center",
    // justifyContent: "center",
    gap: 10,
    flexDirection: "row",
  },
  mainIconContainer: {
    alignItems: "flex-start",
  },
  mainIcon: {
    width: 32,
    height: 32,
    // position: "relative",
    alignItems: "center",
    justifyContent: "center",
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
  },
  privacyPolicyContainer: {
    color: "green",
    fontSize: 18,
    fontStyle: "plus jakarta sans",
    // marginLeft: -10,
    gap: 16,
  },
  extraLinks: {
    color: "green",
    fontSize: 18,
  },
});

export default AboutScreen;
