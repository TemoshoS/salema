import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, Button } from 'react-native';

const UpdateModal = ({ contact, onUpdate, onCancel }) => {
  const [updatedName, setUpdatedName] = useState(contact.name);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState(contact.phoneNumber);

  const handleUpdate = () => {
    const updatedContact = {
      name: updatedName,
      phoneNumber: updatedPhoneNumber,
    };
    onUpdate(updatedContact);
  };

  return (
    <Modal animationType="slide" transparent={false} visible={true}>
      <View style={styles.modalContainer}>
        <Text>Edit Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={updatedName}
          onChangeText={(text) => setUpdatedName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={updatedPhoneNumber}
          onChangeText={(text) => setUpdatedPhoneNumber(text)}
        />
        <Button title="Update" onPress={handleUpdate} />
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
});

export default UpdateModal;
