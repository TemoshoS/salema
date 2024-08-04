import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Modal, TouchableOpacity, FlatList, Share } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPeople, addPerson, addCommentToPerson } from '../services/missingService';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebaseService';

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
  const [missingPersons, setMissingPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ names: '', age: '', lastSeen: '', image: '', contacts: '' });
  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [images, setImage] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [comment, setComment] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const [popupMessage, setPopupMessage] = useState('');

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

      await addCommentToPerson(selectedPerson.id, comment);
      setCommentModalVisible(false);
      setComment('');

      const updatedPersons = missingPersons.map((person) =>
        person.id === selectedPerson.id
          ? { ...person, comments: [...(person.comments || []), comment] }
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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => toggleComments(item.id)}>
      <Image source={{ uri: item.image }} style={styles.image} />
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
      {visibleComments[item.id] && (
        <FlatList
          data={item.comments || []}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
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
            <Text style={styles.addPersonTitle}>Add a Missing Person</Text>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>
            {images && <Image source={{ uri: images }} style={styles.image} />}
            <TextInput
              style={styles.input}
              placeholder="Names"
              placeholderTextColor={'#EDEADE'}
              value={newPerson.names}
              onChangeText={(text) => setNewPerson({ ...newPerson, names: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor={'#EDEADE'}
              value={newPerson.age}
              onChangeText={(text) => setNewPerson({ ...newPerson, age: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Seen"
              placeholderTextColor={'#EDEADE'}
              value={newPerson.lastSeen}
              onChangeText={(text) => setNewPerson({ ...newPerson, lastSeen: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Contacts"
              placeholderTextColor={'#EDEADE'}
              value={newPerson.contacts}
              onChangeText={(text) => setNewPerson({ ...newPerson, contacts: text })}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAddPerson}>
                <Text style={styles.buttonText}>Add Person</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                setAddPersonModalVisible(false);
                resetNewPersonModal();
              }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => {
          setCommentModalVisible(false);
          resetCommentModal();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.addPersonTitle}>Add a Comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Comment"
              placeholderTextColor={'#EDEADE'}
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                <Text style={styles.buttonText}>Add Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                setCommentModalVisible(false);
                resetCommentModal();
              }}>
                <Text style={styles.buttonText}>Cancel</Text>
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
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
  },
  names: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lastSeen: {
    fontSize: 16,
    color: '#666',
  },
  contacts: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFF',
  },
  comment: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  addButtonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#3b5998',
    padding: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addPersonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#EDEADE',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupView: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  popupText: {
    fontSize: 18,
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 5,
  },
  popupButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default MissingScreen;
