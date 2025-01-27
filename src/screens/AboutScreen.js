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


// import AppBar from "../components/Appbar";

const AboutScreen = () => {
  // Function to open the Facebook page in the browser
  const handleFacebookPress = () => {
    Linking.openURL("https://www.facebook.com/Mansalema");
  };

  // Function to open the Twitter page in the browser
  const handleTwitterPress = () => {
    Linking.openURL("https://x.com/mansalema");
  };

  // Function to open the WhatsApp chat
  const handleWhatsAppPress = () => {
    const phoneNumber = "+27671276191";
    const url = `https://wa.me/${phoneNumber}`;
    
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open WhatsApp:", err);
    });
  };

  const handleExternalLink = () => {
    Linking.openURL("#");
  };

  return (
    <ScrollView >
      <View style={styles.container}>
        {/* Topp App bar component */}
        {/* <AppBar navigation={navigation} showProfileIcon={false} screenName="About Us" /> */}

        <View style={styles.imageCard}>
          <Image
            style={styles.cardLogo}
            source={require("../../assets/Union_green.png")}
          />
          <Text style={styles.imageText}>Your Personal Safety Companion</Text>
          <Text style={styles.cardText}>
            Salema is more than just an app - it's your lifeline when you need
            it most. Designed with your safety in mind, Salema allows you to
            quickly and discreetly send emergency SMS alerts to your trusted
            contacts with a simple shake of your phone.
          </Text>
          <Text style={styles.imageCardBGText}>
            Your safety is just a shake away.
          </Text>
          <Image
            style={styles.imageCardBGImage}
            source={require("../../assets/undraw_alert.png")}
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
    gap: 8,
    marginHorizontal: 10,
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
    padding: 12,
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
    // overflow: "hidden",
    marginHorizontal: 20,
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
  },
  // aBOUT PAGE TOP IMAGE
  imageCard: {
    display: "flex",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 90,
    gap: 10,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",

    backgroundColor: "#1E1E1E",
    borderRadius: 20,
  },
  imageCardContent: {
    flexWrap: "wrap",
  },
  imageCardBGImage: {
    width: 180,
    height: 100,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  imageCardBGText: {
    zIndex: -1,
    bottom: 30,
    position: "absolute",
    fontSize: 58,
    textAlign: "right",
    alignContent: "center",
    fontWeight: "700",
    fontFamily: "plus jakarta sans",
    color: "transparent", // Transparent text color
    textShadowColor: "#4848485c", // Black outline color
    textShadowOffset: { width: 1, height: 1 }, // Outline offset
    textShadowRadius: 2, // Outline thickness
    backgroundColor: "transparent",
    margin: 0,
    letterSpacing: 1.5,
  },
  
  imageText: {
    marginVertical: 10,
    fontSize: 34,
    color: "#ffffff",
    fontFamily: "plus jakarta sans",
  },
  cardText: {
    fontSize: 14,
    fontStyle: "plus jakarta sans",
    color: "#f2f2f2",
    // marginTop: 10,
    // width: 400,
  },
  cardLogo: {
    height: 24,
    width: 80,

    top: 10,
    // left : 10,
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
    marginHorizontal: 20,
    padding: 20,
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
