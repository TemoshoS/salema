import React from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, Share, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPeople } from '../services/missingService';

const missingPersons = [
  {
    id: 1,
    name: 'John Doe',
    age: 34,
    lastSeen: 'July 4th, 2024',
    image: 'https://example.com/missing-person1.jpg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 28,
    lastSeen: 'July 5th, 2024',
    image: 'https://example.com/missing-person2.jpg',
  },
  // Add more missing persons as needed
];

const MissingScreen = () => {
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
});

export default MissingScreen;
