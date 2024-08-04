import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig'; // adjust imports as needed

const MissingScreen = () => {
  const [newPerson, setNewPerson] = useState({ names: '', age: '', lastSeen: '', image: '' });
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPerson = async () => {
    try {
      if (!image) {
        Alert.alert('Error', 'Please select an image.');
        return;
      }

      if (
        !newPerson.names ||
        !newPerson.age ||
        !newPerson.lastSeen ||
        !newPerson.image
      ) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }

      const menuCollection = collection(db, 'MissingPersons');
      const imageRef = ref(storage, `missingImages/${newPerson.names}`);

      // Convert image URI to Blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Upload image and get URL
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      // Add new person to Firestore
      const newPersonRef = await addDoc(menuCollection, {
        ...newPerson,
        menuImage: imageUrl,
      });

      Alert.alert('Success', 'New missing person added successfully');
      setNewPerson({ names: '', age: '', lastSeen: '', image: '' });
      setImage(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding person:', error);
      Alert.alert('Error', 'An error occurred while adding the person.');
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        setNewPerson({ ...newPerson, image: result.uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Missing Person</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.addPersonTitle}>Add a Missing Person</Text>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Pick an Image</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Names"
              value={newPerson.names}
              onChangeText={(text) => setNewPerson({ ...newPerson, names: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={newPerson.age}
              onChangeText={(text) => setNewPerson({ ...newPerson, age: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Seen"
              value={newPerson.lastSeen}
              onChangeText={(text) => setNewPerson({ ...newPerson, lastSeen: text })}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Add Person" onPress={handleAddPerson} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addPersonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  previewImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  imageButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MissingScreen;
