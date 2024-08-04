import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Modal, TouchableOpacity, FlatList, Share, Animated } from 'react-native';
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

  // Animated height values
  const [expanded, setExpanded] = useState(null);
  const heightAnim = useRef(new Animated.Value(0)).current;

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
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
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

  const renderItem = ({ item }) => {
    const isExpanded = expanded === item.id;
    
    useEffect(() => {
      Animated.timing(heightAnim, {
        toValue: isExpanded ? 150 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [isExpanded]);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setExpanded(isExpanded ? null : item.id);
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.overlayText}>Missing Person</Text>
        </View>
        {isExpanded && (
          <Animated.View style={{ height: heightAnim }}>
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
            <FlatList
              data={item.comments || []}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Text>{item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  };

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
          <FlatList
            data={selectedPerson.comments || []}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text>{item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={addPersonModalVisible}
        onRequestClose={() => setAddPersonModalVisible(false)}
      >
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
            <Text style={styles.buttonText}>Pick Image</Text>
          </TouchableOpacity>
          {images && <Image source={{ uri: images }} style={styles.selectedImage} />}
          <TouchableOpacity style={styles.modalButton} onPress={handleAddPerson}>
            <Text style={styles.buttonText}>Add Person</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setAddPersonModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add Comment</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter comment"
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleAddComment}>
            <Text style={styles.buttonText}>Add Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setCommentModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add styles here
  card: {
    borderRadius: 8,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  overlayText: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  names: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  lastSeen: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  contacts: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButtonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  addButton: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#28a745',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  imageButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    marginBottom: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    marginBottom: 10,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
  popupButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  popupButtonText: {
    color: '#fff',
  },
});

export default MissingScreen;
