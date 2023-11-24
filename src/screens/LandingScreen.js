import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native";
import { Platform } from "react-native";
import LoginScreen from "./LoginScreen";

const LandingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedContact, setUpdatedContact] = useState("");
  const [removedContact, setRemovedContact] = useState("");

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleUpdateContact = () => {
    // Handle logic for updating contact with the value in updatedContact
    console.log(`Updating contact: ${updatedContact}`);
  };

  const handleRemoveContact = () => {
    // Handle logic for removing contact with the value in removedContact
    console.log(`Removing contact: ${removedContact}`);
  };

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {/* Card */}
        <View style={styles.card}>
          {/* Trusted Contact Heading */}
          <Text style={styles.trustedContact}>Trusted Contact</Text>

          {/* Paragraph */}
          <Text style={styles.paragraph}>
            YOUR EMERGENCY CONTACTS WILL APPEAR HERE.
          </Text>
          <Text style={styles.additionalText}>
            Your emergency contacts will appear here. You currently do not have any emergency contact. Import contacts or add new contacts.
          </Text>

          {/* Add Contact Button */}
          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Text style={styles.addButtonText}>ADD CONTACT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Update Contact Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View >
            {/* Modal Content */}
            <Text style={styles.modalText}>Update or Remove Contact</Text>

            {/* Input for Updating Contact */}
            <TextInput
              style={styles.input}
              placeholder="Enter updated contact"
              placeholderTextColor="#FFFFFF"
              onChangeText={(text) => setUpdatedContact(text)}
            />

            {/* Input for Removing Contact */}
            <TextInput
              style={styles.input}
              placeholder="Enter contact to remove"
              placeholderTextColor="#FFFFFF"
              onChangeText={(text) => setRemovedContact(text)}
            />

            {/* Update and Remove Contact Buttons */}
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateContact}>
              <Text style={styles.buttonText}>UPDATE CONTACT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveContact}>
              <Text style={styles.buttonText}>REMOVE CONTACT</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Login Form Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <LoginScreen/>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20, // Adjust as needed
  },
  card: {
    width: "100%", // Fill (393px)
    height: 211, // Hug (211px)
    padding: 30,
    borderRadius: 20,
    gap: 20,
    backgroundColor: "#125127",
  },
  trustedContact: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "center",
    color: "#FFFFFF", // White text color
  },
  additionalText: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "400",
    lineHeight: 18,
    letterSpacing: 0.16,
    textAlign: "center",
    marginTop: -20,
    color: "#FFFFFF", // White text color
  },
  paragraph: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: 0.16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  addButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    height: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginTop: -10,
  },
  addButtonText: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
    marginTop: -10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCard: {
    width: "100%", // Fill (393px)
    padding: 30,
    borderRadius: 20,
    gap: 20,
    backgroundColor: "#002E15",
    marginBottom: 20,
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  updateButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginBottom: 10,
  },
  removeButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FF4040",
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
  },
  closeButton: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginTop: 10,
  },
  closeButtonText: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
  },
});

export default LandingScreen;
