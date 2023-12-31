import React from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import RegistrationScreen from "../screens/RegistrationScreen";

const myModal = ({ isVisible, onClose }) => {
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
          {/* Our Login Modal content goes here */}
          
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default myModal;
