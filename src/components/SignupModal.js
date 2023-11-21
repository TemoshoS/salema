import React from "react";
import { View, Modal, Text, TouchableOpacity } from "react-native";
import RegistrationScreen from "../screens/RegistrationScreen";

const SignupModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Your modal content goes here */}
        <RegistrationScreen  />
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export default SignupModal;
