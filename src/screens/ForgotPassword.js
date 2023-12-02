import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import InputText from "../components/InputText";
import { resetPassword } from "../services/authService";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const ForgotPassword = ({ onPress, closePasswordResetModal }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);


  const handleForgotPassword = async () => {

    try {
      await resetPassword(email).then(() => {
        closePasswordResetModal()

        Toast.show({
          type: 'success',
          text1: 'Check your email for passowrd reset',
          position: 'bottom',
          visibilityTime: 3000
        });

      });
      // closeModal();
    } catch (error) {
      console.log("error, password reset failed");
      Toast.show({
        type: 'error',
        text1: 'Email does not exist , Please enter valid email ',
        position: 'bottom',
        visibilityTime: 3000
      });
    }
  }

  const closeModal = () => {
    closePasswordResetModal()

  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => closeModal()}>
        <Ionicons name="ios-close" size={24} color="white" />
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.resetForm}>

          <View style={styles.formContent}>

            <Text style={styles.title}>Reset Password</Text>

            <InputText
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="existingEmail@123.com"
              placeholderTextColor="#f2f2f2"
              label={"Email"}
            />
          </View>


          <TouchableOpacity onPress={() => handleForgotPassword()} style={styles.resetButton}>
            <Text>
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    // marginTop: 25,
    // paddingHorizontal: 8,

  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f2f2f2",
    textAlign: "center",
  },
  readyText: {
    fontWeight: "400",
    fontSize: 15,
    width: 55,
    height: 7,
    bottom: 100,
    textAlign: "center",
  },
  resetForm: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#002E15",
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    marginHorizontal: 8,
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
  input: {
    width: 300,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    bottomBorderColor: "white",
  },
  resetButton: {
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
    alignItems: "center",
    justifyContent: 'center'
  },
  closeIcon: {
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    justifyContent: "flex-end",
    margin: 8,
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


});