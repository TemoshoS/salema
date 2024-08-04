import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, Alert, Share, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPeople, addPerson } from '../services/missingService';

const MissingScreen = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: '', age: '', lastSeen: '', image: '' });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const people = await getPeople();
      setMissingPersons(people);
    };

    fetchData();
  }, []);

  const handleComment = (name) => {
    Alert.alert(`Comment button pressed for ${name}`);
  };

  const handleShare = async (name) => {
    try {
      const result = await Share.share({
        message: `Help find ${name}! Here are the details...`,
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
    if (!newPerson.name || !newPerson.age || !newPerson.lastSeen || !newPerson.image) {
      Alert.alert('All fields are required!');
      return;
    }

    try {
      await addPerson(newPerson);
      const people = await getPeople();
      setMissingPersons(people);
      setNewPerson({ name: '', age: '', lastSeen: '', image: '' });
      setModalVisible(false);
      Alert.alert('New missing person added successfully');
    } catch (error) {
      Alert.alert('Error adding person', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {missingPersons.map((person) => (
        <View key={person.id} style={styles.card}>
          <Image source={{ uri: person.image }} style={styles.image} />
          <Text style={styles.name}>{person.name}, {person.age} years old</Text>
          <Text style={styles.lastSeen}>Last seen on {person.lastSeen}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Comment" onPress={() => handleComment(person.name)} />
            <FontAwesome.Button name="share" backgroundColor="#3b5998" onPress={() => handleShare(person.name)}>
              Share
            </FontAwesome.Button>
          </View>
        </View>
      ))}
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
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newPerson.name}
              onChangeText={(text) => setNewPerson({ ...newPerson, name: text })}
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
              placeholder="Image URL"
              value={newPerson.image}
              onChangeText={(text) => setNewPerson({ ...newPerson, image: text })}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Add Person" onPress={handleAddPerson} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastSeen: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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
});

export default MissingScreen;
