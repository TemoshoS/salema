// import { Card } from "@rneui/themed";
import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
// Navigation Contents
import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";

// components
import BottomNav from "../components/BottomNav";
import ChipButton from "../components/Chip";
import { Button } from "react-native-web";

 //const Stack = createNativeStackNavigator(); //nav container

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("/assets/union.png")}
        style={styles.logoImg}
        accessibilityLabel="logo image"
      />
      <Text>Your safety is just a shake away</Text>
      {/* Staus image */}

      <View style={styles.textContent}>
        <Image
          source={require("/assets/Vector.png")}
          style={styles.signalImg}
          accessibilityLabel="status signalimage"
        />
        <Text style={styles.title}>"Shake to Alert"</Text>
        <Text style={styles.text}>
          In an emergency, every second counts, just give your phone a quick
          shake to send out an alert to your chosen contacts
        </Text>
      </View>

      {/* Backkground Image */}
      <Image
        source={require("/assets/undraw_different_love_a-3-rg 1.png")}
        style={styles.BgImage}
        accessibilityLabel="status signalimage"
      />

      {/* CONTACT LIST CARD */}
      <View style={styles.cardContainer}>
      <Text style={styles.title}>Trusted Contacts</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactList}>
            <ChipButton
              title={"Name"}
              onPress={() =>
                console.log("send me to view contact ||  edit contact")
              }
              type="outline"
              altText={"contact"}
            />
            <ChipButton
              title={"Name"}
              onPress={() =>
                console.log("send me to view contact ||  edit contact")
              }
              type="outline"
              altText={"contact"}
            />
            <ChipButton
              title={"Name"}
              onPress={() =>
                console.log("send me to view contact ||  edit contact")
              }
              type="outline"
              altText={"contact"}
            />
          </View>

          <Button title="Add Contact" onPress={() => {}} />
        </View>
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "column",
    padding: 8,
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
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // position: "absolute",
    bottom: -20,
    // marginHorizontal: 8,
  },
  contactCard: {
    width: "100%",
    position: "absolute",
    flexDirection: "column",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    zIndex: 1, //above screen contents
    borderRadius: 20,
    // backgroundColor: '#fff',
    backgroundColor: "#055a2b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    //
    gap: 16,
  },
  contactList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
});

export default HomeScreen;
