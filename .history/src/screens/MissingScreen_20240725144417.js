import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, Alert, Share, Modal, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPeople, addPerson, addCommentToPerson } from '../services/missingService';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebaseService';

const MissingScreen = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ names: '', age: '', lastSeen: '', image: '', contacts: '' });
  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [images, setImage] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [comment, setComment] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
 
  useEffect(() => {
    const fetchData = async () => {
      const people = await getPeople();
      setMissingPersons(people);
    };
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'We need permission to access your photo library.');
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
        alert('Please select a person and enter a comment.');
        return;
      }

      await addCommentToPerson(selectedPerson.id, comment);
      setCommentModalVisible(false);
      setComment('');

      // Immediately update the local state to reflect the new comment
      const updatedPersons = missingPersons.map((person) =>
        person.id === selectedPerson.id
          ? { ...person, comments: [...(person.comments || []), comment] }
          : person
      );

      setMissingPersons(updatedPersons);

      // Ensure the comments section is visible for the selected person
      setVisibleComments((prevState) => ({
        ...prevState,
        [selectedPerson.id]: true,
      }));
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleShare = async (names, lastSeen, age, image, contacts) => {
    try {
      const result = await Share.share({
        message: `Help find ${names}! Last seen: ${lastSeen}, Age: ${age}, Contacts: ${contacts}, Picture: ${image}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleAddPerson = async () => {
    try {
      console.log('newPerson:', newPerson);
      console.log('images:', images);
      
      // Validate input fields
      if (!newPerson.names || !newPerson.age || !newPerson.lastSeen || !newPerson.contacts || !images) {
        Alert.alert('Error', 'Please fill in all the fields and select an image.');
        return;
      }
  
      // Upload the image to Firebase Storage
      const response = await fetch(images);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
  
      // Add the new person to Firestore
      const personWithImage = { ...newPerson, image: imageUrl };
      await addPerson(personWithImage);
  
      // Fetch the updated list of missing persons
      const updatedPeople = await getPeople();
      setMissingPersons(updatedPeople);
  
      // Close the modal and reset the form
      setAddPersonModalVisible(false);
      setNewPerson({ names: '', age: '', lastSeen: '', image: '', contacts: '' });
      setImage(null); // Reset the image state
    } catch (error) {
      Alert.alert('Error', error.message);
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
        console.log('Picked image URI:', result.assets[0].uri);
        setImage(result.assets[0].uri); // Ensure this is being set correctly
      } else {
        console.log('Image picker was canceled or no assets were returned');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => toggleComments(item.id)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.names}>{item.names}, {item.age} years old</Text>
      <Text style={styles.lastSeen}>{item.lastSeen}</Text>
      <Text style={styles.contacts}>Contacts {item.contacts}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Comment" onPress={() => handleComment(item)} />
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
          <TouchableOpacity style={styles.addButton} onPress={() => setAddPersonModalVisible(true)}>
            <Text style={styles.addButtonText}>Add Missing Person</Text>
          </TouchableOpacity>
        }
      />
      <Modal
  animationType="slide"
  transparent={true}
  visible={addPersonModalVisible}
  onRequestClose={() => setAddPersonModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalView}>
      <Text style={styles.addPersonTitle}>Add a Missing Person</Text>
      
      {/* Image Picker Button */}
      <Button title="Pick Image" onPress={pickImage} />
      {images && <Image source={{ uri: images }} style={styles.image} />}
      
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

      <View style={styles.modalButtonContainer}>
        <Button title="Add Person" onPress={handleAddPerson} />
        <Button title="Cancel" onPress={() => setAddPersonModalVisible(false)} />
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
            <Text style={styles.addPersonTitle}>Add a Comment</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your comment here"
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Add Comment" onPress={handleAddComment} />
              <Button title="Cancel" onPress={() => setCommentModalVisible(false)} />
            </View>
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
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
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
  addButton: {
    backgroundColor: '#C8FFD7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: 300,
    height: 48,
    
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default MissingScreen;
