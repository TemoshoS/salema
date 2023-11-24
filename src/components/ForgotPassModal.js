import React from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import ForgotPassword from "../screens/ForgotPassword";

const ForgotPassModal = ({ isVisible, onClose }) => {
  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#00000080" }}>
          {/* Your ForgotPassword Modal content goes here */}
          <ForgotPassword/>
          {/* <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>ForgotPassword Modal Content</Text>
            <TouchableOpacity onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ForgotPassModal;
