import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Modal, TouchableOpacity, FlatList, ScrollView, Share } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPeople, addPerson, addCommentToPerson } from '../services/missingService';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebaseService';
import { getAuth } from "firebase/auth";
import authService from "../services/authService";

const Popup = ({ message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!message}
      onRequestClose={onClose}
    >
      <View style={styles.popupContainer}>
        <View style={styles.popupView}>
          <Text style={styles.popupText}>{message}</Text>
          <TouchableOpacity style={styles.popupButton} onPress={onClose}>
            <Text style={styles.popupButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const MissingScreen = () => {
  const auth = getAuth();
  const [missingPersons, setMissingPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ names: '', age: '', lastSeen: '', image: '', contacts: '' });
  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [images, setImage] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [comment, setComment] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const {
    checkUserLoggedIn,
    user,
  } = authService();

  useEffect(() => {
    const fetchData = async () => {
      const people = await getPeople();
      setMissingPersons(people);
    };
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setPopupMessage('We need permission to access your photo library.');
      }
    };

    requestPermissions();
    fetchData();
  }, []);

  const handleComment = (person) => {
    setSelectedPerson(person);
    setComment('');
    setCommentModalVisible(true);
  };

  const handleAddComment = async () => {
    try {
      if (!selectedPerson || !comment.trim()) {
        setPopupMessage('Please select a person and enter a comment.');
        return;
      }

      await addCommentToPerson(selectedPerson.id, comment);

      const updatedPersons = missingPersons.map((person) =>
        person.id === selectedPerson.id
          ? { ...person, comments: [...(person.comments || []), comment] }
          : person
      );

      setMissingPersons(updatedPersons);

      // Immediately update the selected person’s comments to show the new comment
      setSelectedPerson({
        ...selectedPerson,
        comments: [...(selectedPerson.comments || []), comment],
      });

      setCommentModalVisible(false);
      setComment('');

      setPopupMessage('Comment added successfully!');
    } catch (error) {
      setPopupMessage(error.message);
    }
  };

  const handleShare = async (names, lastSeen, age, image, contacts) => {
    try {
      const result = await Share.share({
        message: `Help find ${names}! Last seen: ${lastSeen}, Age: ${age}, Contacts: ${contacts}, Picture: ${image}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type
        } else {
          // Shared without activity type
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      setPopupMessage(error.message);
    }
  };

  const handleAddPerson = async () => {
    try {
      if (!newPerson.names || !newPerson.age || !newPerson.lastSeen || !newPerson.contacts || !images) {
        setPopupMessage('Please fill in all the fields and select an image.');
        return;
      }

      const response = await fetch(images);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const personWithImage = { ...newPerson, image: imageUrl };
      await addPerson(personWithImage);

      const updatedPeople = await getPeople();
      setMissingPersons(updatedPeople);

      setAddPersonModalVisible(false);
      resetNewPersonModal();

      setPopupMessage('Person added successfully!');
    } catch (error) {
      setPopupMessage(error.message);
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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      setPopupMessage(error.message);
    }
  };

  const resetNewPersonModal = () => {
    setNewPerson({ names: '', age: '', lastSeen: '', image: '', contacts: '' });
    setImage(null);
  };

  const resetCommentModal = () => {
    setComment('');
    setSelectedPerson(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedPerson(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.overlayText}>Missing Person</Text>
      </View>
      {selectedPerson?.id === item.id && (
        <>
          <Text style={styles.names}>{item.names}, {item.age} years old</Text>
          <Text style={styles.lastSeen}>{item.lastSeen}</Text>
          <Text style={styles.contacts}>Contacts {item.contacts}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleComment(item)}>
              <Text style={styles.buttonText}>Comment</Text>
            </TouchableOpacity>
            <FontAwesome.Button name="share" backgroundColor="#3b5998" onPress={() => handleShare(item.names, item.lastSeen, item.age, item.image, item.contacts)}>
              Share
            </FontAwesome.Button>
          </View>
          <ScrollView style={styles.commentContainer}>
            {item.comments?.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <Text>{comment}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {!selectedPerson ? (
        <FlatList
          data={missingPersons}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.addButtonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={() => setAddPersonModalVisible(true)}>
                <Text style={styles.addButtonText}>Add Missing Person</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.selectedCardContainer}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.button} onPress={() => setSelectedPerson(null)}>
              <Text style={styles.buttonText}>Back to List</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedPerson.image }} style={styles.image} />
              <Text style={styles.overlayText}>Missing Person</Text>
            </View>
            <Text style={styles.names}>{selectedPerson.names}, {selectedPerson.age} years old</Text>
            <Text style={styles.lastSeen}>{selectedPerson.lastSeen}</Text>
            <Text style={styles.contacts}>Contacts {selectedPerson.contacts}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleComment(selectedPerson)}>
                <Text style={styles.buttonText}>Comment</Text>
              </TouchableOpacity>
              <FontAwesome.Button name="share" backgroundColor="#3b5998" onPress={() => handleShare(selectedPerson.names, selectedPerson.lastSeen, selectedPerson.age, selectedPerson.image, selectedPerson.contacts)}>
                Share
              </FontAwesome.Button>
            </View> 
            <ScrollView style={styles.commentContainer}>
              {selectedPerson.comments?.map((comment, index) => (
                <View key={index} style={styles.comment}>
                  <Text>{comment}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addPersonModalVisible}
        onRequestClose={() => setAddPersonModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Missing Person</Text>
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
            <TextInput
              style={styles.input}
              placeholder="Contacts"
              value={newPerson.contacts}
              onChangeText={(text) => setNewPerson({ ...newPerson, contacts: text })}
            />
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Select Image</Text>
            </TouchableOpacity>
            {images && <Image source={{ uri: images }} style={styles.imagePreview} />}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddPerson}>
                <Text style={styles.modalButtonText}>Add Person</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setAddPersonModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Comment"
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddComment}>
                <Text style={styles.modalButtonText}>Add Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setCommentModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    
  },
  overlayText: {
    position: 'absolute',
    top: 35,
    left: -5, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#ffffff',
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
    textAlign: 'center',
  },
  names: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lastSeen: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  contacts: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#C8FFD7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    height: 48,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#36454F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textArea: {
    height: 100, 
    textAlignVertical: 'top', 
    padding: 10, 
    borderColor: '#ccc',
    borderWidth: 1,  
    borderRadius: 5, 
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
    backgroundColor: "#002E15",
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
    color: '#fff',
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#EDEADE',
    fontWeight: 'bold',
    
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#C8FFD7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonText: {
    color: '#36454F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginTop: 15,
    maxHeight: 200, // Adjust the height as needed
  },
  comment: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  popupText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    
  },
  popupButton: {
    backgroundColor: '#C8FFD7',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  popupButtonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});

export default MissingScreen;
