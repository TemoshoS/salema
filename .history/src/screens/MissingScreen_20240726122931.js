import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, Modal, StyleSheet, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebaseService';
import { getAuth } from 'firebase/auth';
import authService from '../services/authService';
import { getPeople, addPerson, addCommentToPerson } from '../services/missingService';
import { FontAwesome } from '@expo/vector-icons';

const MissingScreen = () => {
  const auth = getAuth();
  const [missingPersons, setMissingPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ names: '', age: '', lastSeen: '', image: '', contacts: '' });
  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [images, setImage] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [comment, setComment] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const [popupMessage, setPopupMessage] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');

  const { checkUserLoggedIn } = authService();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await checkUserLoggedIn();
        if (currentUser) {
          setCurrentUserName(currentUser.displayName || 'Anonymous');
        }
      } catch (error) {
        setPopupMessage('Error fetching user data.');
      }
    };

    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setPopupMessage('We need permission to access your photo library.');
      }
    };

    const fetchPeopleData = async () => {
      try {
        const people = await getPeople();
        setMissingPersons(people);
      } catch (error) {
        setPopupMessage('Error fetching people data.');
      }
    };

    const initialize = async () => {
      await fetchUserData();
      await requestPermissions();
      await fetchPeopleData();
    };

    initialize();
  }, [checkUserLoggedIn]);

  const toggleComments = (personId) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [personId]: !prevState[personId],
    }));
  };

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

      const formattedComment = `${currentUserName}: ${comment}`;
      await addCommentToPerson(selectedPerson.id, formattedComment);
      setCommentModalVisible(false);
      setComment('');

      const updatedPersons = missingPersons.map((person) =>
        person.id === selectedPerson.id
          ? { ...person, comments: [...(person.comments || []), formattedComment] }
          : person
      );

      setMissingPersons(updatedPersons);
      setVisibleComments((prevState) => ({
        ...prevState,
        [selectedPerson.id]: true,
      }));

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
          // Shared with activity type of result.activityType
        } else {
          // Shared
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
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      setPopupMessage('Error picking image.');
    }
  };

  const resetNewPersonModal = () => {
    setNewPerson({
      names: '',
      age: '',
      lastSeen: '',
      image: '',
      contacts: '',
    });
    setImage(null);
  };

  // PostCard component defined within MissingScreen
  const PostCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.names}>{item.names}, {item.age} years old</Text>
        <Text style={styles.lastSeen}>Last seen: {item.lastSeen}</Text>
        <Text style={styles.contacts}>Contacts: {item.contacts}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleComment(item)}>
          <Text style={styles.buttonText}>Comment</Text>
        </TouchableOpacity>
        <FontAwesome.Button 
          name="share" 
          backgroundColor="#3b5998" 
          onPress={() => handleShare(item.names, item.lastSeen, item.age, item.image, item.contacts)}
        >
          Share
        </FontAwesome.Button>
      </View>
      {visibleComments[item.id] && (
        <FlatList
          data={item.comments || []}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setAddPersonModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Missing Person</Text>
      </TouchableOpacity>

      <FlatList
        data={missingPersons}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item) => item.id}
      />

      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />

      {/* Add Person Modal */}
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
              placeholder="Name"
              value={newPerson.names}
              onChangeText={(text) => setNewPerson({ ...newPerson, names: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={newPerson.age}
              onChangeText={(text) => setNewPerson({ ...newPerson, age: text })}
              keyboardType="numeric"
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
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>{images ? 'Change Image' : 'Pick Image'}</Text>
            </TouchableOpacity>
            {images && <Image source={{ uri: images }} style={styles.imagePreview} />}
            <TouchableOpacity style={styles.modalButton} onPress={handleAddPerson}>
              <Text style={styles.modalButtonText}>Add Person</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setAddPersonModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Comment Modal */}
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
              style={styles.textarea}
              placeholder="Write your comment here..."
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddComment}>
              <Text style={styles.modalButtonText}>Add Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setCommentModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flex: 1
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  names: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastSeen: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  contacts: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
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
