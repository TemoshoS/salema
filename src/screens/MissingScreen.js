import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Modal, TouchableOpacity, FlatList, ScrollView, Share } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPeople, addPerson, addCommentToPerson } from '../services/missingService';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebaseService';
import authService from "../services/authService";
import { FontAwesome5 } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';


import {
  BallIndicator,
  MaterialIndicator,
} from 'react-native-indicators';



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
  const { checkUserLoggedIn, user } = authService();
  const [missingPersons, setMissingPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ names: '', age: '', lastSeen: '', image: '', contacts: '' });
  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [images, setImage] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [comment, setComment] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [zoomImageVisible, setZoomImageVisible] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');


  const nameInputRef = useRef(null);
  const ageInputRef = useRef(null);
  const lastSeenInputRef = useRef(null);
  const contactsInputRef = useRef(null);

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
    checkUserLoggedIn().then(loggedIn => setIsUserLoggedIn(loggedIn));
  }, []);

  const handleComment = (person) => {
    setSelectedPerson(person);
    setComment('');
    setCommentModalVisible(true);
  };

  const handleAddComment = async () => {
    try {

      setCommentLoading(true);
      if (!selectedPerson || (!comment.trim() && !commentImage)) {
        setPopupMessage('Please select a person and enter a comment or select an image.');
        return;
      }

      // Get the username of the current user
      const username = user?.displayName || 'Anonymous';

      await addCommentToPerson(selectedPerson.id, comment, commentImage, username);

      const updatedPersons = missingPersons.map((person) =>
        person.id === selectedPerson.id
          ? { ...person, comments: [{ text: comment, image: commentImage, username }, ...(person.comments || [])] }
          : person
      );

      setMissingPersons(updatedPersons);

      setSelectedPerson({
        ...selectedPerson,
        comments: [{ text: comment, image: commentImage, username }, ...(selectedPerson.comments || [])],
      });

      setCommentModalVisible(false);
      setComment('');
      setCommentImage(null);

      setPopupMessage('Comment added successfully!');
    } catch (error) {
      setPopupMessage(error.message);
    } finally {
      setCommentLoading(false);
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
    if (!isUserLoggedIn) {
      setPopupMessage('You need to be logged in to add a missing person.');
      return;
    }

    try {
      setLoading(true);
      if (!newPerson.names || !newPerson.age || !newPerson.lastSeen || !newPerson.contacts || !images) {
        setPopupMessage('Please fill in all the fields and select an image.');
        return;
      }

      const response = await fetch(images);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const personWithImage = { ...newPerson, image: imageUrl, postedBy: user.displayName };
      await addPerson(personWithImage);

      const updatedPeople = await getPeople();
      setMissingPersons(updatedPeople);

      setAddPersonModalVisible(false);
      resetNewPersonModal();

      setPopupMessage('Missing person added successfully');
      await sendSuccessNotification('Missing person added successfully');
    } catch (error) {
      setPopupMessage(error.message);
    }
    finally {
      setLoading(false);
    }
  };


  const sendSuccessNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Success!",
        body: message,
        data: { message },
      },
      trigger: { seconds: 1 },
    });
  };


  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      setPopupMessage(error.message);
    }
  };


  const pickCommentImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCommentImage(result.assets[0].uri);
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
    setCommentImage(null);
    setSelectedPerson(null);
  };

  const handleZoomImage = (imageUrl) => {
    if (imageUrl) {
      setZoomImageUrl(imageUrl);
      setZoomImageVisible(true);
    } else {
      setPopupMessage('No image URL provided.');
    }
  };




  const handlePray = (person) => {
    const message = `Sending heartfelt prayers for ${person.names}. May they be found safe and sound.`;
    setPopupMessage(message);
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedPerson(item)}
    >
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => handleZoomImage(item.image)}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>

      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.names}>{item.names}, {item.age} years old</Text>
        <Text style={styles.lastSeen}>{item.lastSeen}</Text>
        <Text style={styles.contacts}>Contacts: {item.contacts}</Text>
        <Text style={styles.posted}>Posted By: {item.postedBy}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonPost} onPress={() => handlePray(item)}>
            <MaterialCommunityIcons name="hands-pray" size={24} color="#36454F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonPost} onPress={() => handleComment(item)}>
            <FontAwesome name="comment" size={24} color="#36454F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonPost} onPress={() => handleShare(item.names, item.lastSeen, item.age, item.image, item.contacts)}>
            <FontAwesome name="share" size={24} color="#36454F" />
          </TouchableOpacity>
        </View>

      </View>
    </TouchableOpacity>
  );

  const parseTimestamp = (timestamp) => {
    if (!timestamp) return 'Invalid date';
    const date = new Date(Date.parse(timestamp));
    return isNaN(date) ? 'Invalid date' : date.toLocaleString();
  };

  const focusNextField = (nextInputRef) => {
    if (nextInputRef.current) {
      nextInputRef.current.focus();
    }
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
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setSelectedPerson(null);
              resetCommentModal();
            }}
          >
            <Text style={styles.buttonText}>Back to List</Text>
          </TouchableOpacity>

          <ScrollView style={styles.commentContainer}>
            {selectedPerson.comments?.reverse().map((comment, index) => (
              <View key={index} style={styles.comment}>
                <View style={styles.commentC}>
                  <Text style={styles.commentUser}>{comment.username}: </Text>
                  <Text>{comment.text}</Text>
                </View>

                <TouchableOpacity onPress={() => handleZoomImage(comment.image)}>
                  {comment.image && (
                    <Image source={{ uri: comment.image }} style={styles.commentImage} />
                  )}
                </TouchableOpacity>


              </View>
            ))}
          </ScrollView>


          <View style={styles.addCommentContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Add a comment"
                placeholderTextColor="gray"
                value={comment}
                onChangeText={(text) => setComment(text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                <Feather name="send" size={24} color="#36454F" />
                {commentLoading && <MaterialIndicator color='#3c78e9' size={30} />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={pickCommentImage}>
              <FontAwesome name="image" size={20} color="#36454F" />
            </TouchableOpacity>
            {commentImage && (
              <Image source={{ uri: commentImage }} style={styles.commentImage} />
            )}
          </View>


        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addPersonModalVisible}
        onRequestClose={() => {
          setAddPersonModalVisible(false);
          resetNewPersonModal();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Missing Person</Text>
            <ScrollView>
              <TextInput
                ref={nameInputRef}
                style={styles.input}
                placeholder="Names"
                placeholderTextColor='white'
                value={newPerson.names}
                onChangeText={(text) => setNewPerson({ ...newPerson, names: text })}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(ageInputRef)}
              />
              <TextInput
                ref={ageInputRef}
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                placeholderTextColor='white'
                value={newPerson.age}
                onChangeText={(text) => setNewPerson({ ...newPerson, age: text })}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(lastSeenInputRef)}
              />
              <TextInput
                ref={lastSeenInputRef}
                style={styles.input}
                placeholderTextColor='white'
                placeholder="Description"
                value={newPerson.lastSeen}
                onChangeText={(text) => setNewPerson({ ...newPerson, lastSeen: text })}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(contactsInputRef)}
              />
              <TextInput
                ref={contactsInputRef}
                style={styles.input}
                placeholder="Contacts"
                placeholderTextColor='white'
                value={newPerson.contacts}
                onChangeText={(text) => setNewPerson({ ...newPerson, contacts: text })}
                returnKeyType="done"
                keyboardType="numeric"
                onSubmitEditing={pickImage}
              />
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <FontAwesome name="image" size={20} color="#36454F" />
              </TouchableOpacity>
              {images && <Image source={{ uri: images }} style={styles.selectedImage} />}

              <View style={styles.addCancelContainer}>
                <TouchableOpacity style={styles.button} onPress={handleAddPerson} disabled={loading}>
                  {loading ? <BallIndicator size={30} color="blue" /> : <Text style={styles.buttonText}>Add Person</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalCButton} onPress={() => {
                  setAddPersonModalVisible(false);
                  resetNewPersonModal();
                }}>
                  <Text style={styles.modalCButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />

      {/* Zoom Image Modal */}
      <Modal
        visible={zoomImageVisible}
        transparent={true}
        onRequestClose={() => setZoomImageVisible(false)}
      >

        {zoomImageUrl ? (
          <ImageViewer imageUrls={[{ url: zoomImageUrl }]} />
        ) : (
          <Text>No image to display</Text>
        )}

      </Modal>




    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    transform: [{ rotate: '-45deg' }],
    textAlign: 'center',

  },
  detailsContainer: {
    padding: 10,
  },
  names: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  lastSeen: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  contacts: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  posted: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  buttonPost: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  commentContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  commentC: {
    flexDirection: 'row',

  },
  commentUser: {
    fontWeight: 'bold',
  },
  addCommentContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textArea: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    color: 'gray',
    height: 100,
  },
  button: {
    backgroundColor: "#C8FFD7",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
  },

  buttonText: {
    color: '#055a2b',
    fontWeight: 'bold',
  },
  addButtonContainer: {
    padding: 10,
  },
  addButton: {
    backgroundColor: '#C8FFD7',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#002E15',
    fontWeight: 'bold',


  },
  modalZoom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#002E15',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',

  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'white',
    color: 'white',
    padding: 10,
    marginBottom: 10,


  },
  imagePickerButton: {
    backgroundColor: "#C8FFD7",
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold'
  },
  selectedImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  addCancelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,


  },
  modalButton: {
    backgroundColor: "#C8FFD7",
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalCButton: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalCButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  comment: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  commentImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginVertical: 10,
    borderRadius: 10,
  },
  commentTimestamp: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
  popupButton: {
    backgroundColor: '#36454F',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  popupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default MissingScreen;
