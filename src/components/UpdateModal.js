import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import UpdateModal from './UpdateModal'; // Update the path to match your project structure
import { updateContact } from '../services/homeServices'; // Import the Firebase Firestore update function

const UpdateModalScreen = () => {
  const [contact, setContact] = useState({
    name: 'John Doe',
    phoneNumber: '555-123-4567',
  });

  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  // Function to open the modal for updating the contact
  const openUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  // Function to close the modal
  const closeUpdateModal = () => {
    setUpdateModalVisible(false);
  };

  // Function to update the contact with new information
  const updateContactInfo = (updatedContact) => {
    // Call the Firebase Firestore update function
    updateContact(contact.id, updatedContact)
      .then(() => {
        // Update the local contact data
        setContact({ ...contact, ...updatedContact });
        // Close the modal
        closeUpdateModal();
      })
      .catch((error) => {
        // Handle errors, e.g., show an error message
        console.error('Error updating contact: ', error);
      });
  };

  return (
    <View>
      <Text>Contact Information:</Text>
      <Text>Name: {contact.name}</Text>
      <Text>Phone Number: {contact.phoneNumber}</Text>

      <Button title="Edit Contact" onPress={openUpdateModal} />

      <UpdateModal
        contact={contact}
        onUpdate={updateContactInfo}
        onCancel={closeUpdateModal}
        visible={isUpdateModalVisible}
      />
    </View>
  );
};

export default UpdateModalScreen;
