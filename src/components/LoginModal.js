import React from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import LoginScreen from "../screens/LoginScreen";

const LoginModal = ({ isVisible, onClose }) => {
  const handleModalPress = (event) => {
    // Check if the touch event is within the modal content
    if (event.target === event.currentTarget) {
      onClose(); // Close the modal only if the user clicked outside the content
    }
  };

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose} animationType="slide">
      <TouchableWithoutFeedback onPress={handleModalPress}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000080" }}>
          {/* Your Login Modal content goes here */}
          <LoginScreen/>
          {/* <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>Login Modal Content</Text>
            <TouchableOpacity onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LoginModal;