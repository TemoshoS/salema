import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TextField from "../components/TextField";
// Authenticatioon
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import InputText from "../components/InputText";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.contactCard}>
      <Text style={styles.title}>Forgot Password Screen</Text>
      <InputText
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        placeholder="Email"
      />
      <InputText
        value={Number}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        placeholder="OTP digits"
      />
      <View style={styles.buttonGroup}>
        <Button
          title="Resend Password"
          onPress={showUpdateModal}
          altText="Resend Password"
        />
        <Button
          title="Cancel"
          onPress={() => handleRemoveContact(selectedContact.id)}
          altText="Cancel Password Reset"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f2f2f2",
    textAlign: "center",
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
    justifyContent: "flex-end",
    //above screen contents
    borderRadius: 20,
    // backgroundColor: '#fff',
    color: "#f2f2f2",
    backgroundColor: "#055a2b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 200,
    gap: 16,
  },
  buttonGroup: {
    width: "100%",
    flexDirection: "column",
    // flexWrap: "wrap",
    alignItems: "left",
    gap: 8,
    justifyContent: "flex-end",
  },
});
